import { createHmac, timingSafeEqual } from "node:crypto";
import { FastifyInstance } from "fastify";
import { and, eq, or } from "drizzle-orm";
import { db, subscriptions, organizations } from "@netthouse/db";
import { requireOwnClerkOrg } from "../lib/auth.js";

const NOWPAYMENTS_API = "https://api.nowpayments.io/v1";
const NOWPAYMENTS_CURRENCY = "usdcbase";

const TIERS = {
  free: { name: "Free", price: 0, commissionPercent: 10 },
  pro: { name: "Pro", price: 29, commissionPercent: 5 },
  enterprise: { name: "Enterprise", price: 299, commissionPercent: 2 },
} as const;

type PaidTier = "pro" | "enterprise";
type PaymentStatus = "waiting" | "confirming" | "confirmed" | "sending" | "partially_paid" | "finished" | "failed" | "refunded" | "expired";

function requireNowPaymentsKey() {
  const key = process.env.NOWPAYMENTS_API_KEY;
  if (!key) throw Object.assign(new Error("NOWPAYMENTS_API_KEY is not configured"), { statusCode: 500 });
  return key;
}

function webhookUrl() {
  return process.env.NOWPAYMENTS_IPN_URL ?? "https://api.netthouse.com/webhooks/nowpayments";
}

function sortedJson(value: Record<string, unknown>) {
  return JSON.stringify(value, Object.keys(value).sort());
}

function verifySignature(payload: Record<string, unknown>, signature: string | undefined) {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha512", secret).update(sortedJson(payload)).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const actualBuffer = Buffer.from(signature, "utf8");
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

export default async function billingRoutes(fastify: FastifyInstance) {
  fastify.get("/billing/:orgId", async (request) => {
    const { orgId } = request.params as { orgId: string };
    await requireOwnClerkOrg(request, orgId);
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.orgId, orgId)).limit(1);
    const tier = (sub?.tier ?? "free") as keyof typeof TIERS;
    return {
      tier: sub?.tier ?? "free",
      commissionPercent: TIERS[tier]?.commissionPercent ?? 10,
      status: sub?.status ?? "active",
      currentPeriodEnd: sub?.currentPeriodEnd ?? null,
    };
  });

  fastify.post("/billing/checkout", async (request, reply) => {
    const { orgId, tier } = request.body as { orgId?: string; tier?: string };
    if (!orgId || (tier !== "pro" && tier !== "enterprise")) {
      return reply.status(400).send({ error: "Only Pro and Enterprise checkout is available" });
    }
    await requireOwnClerkOrg(request, orgId);
    const [org] = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1);
    if (!org) return reply.status(404).send({ error: "Organization not found" });

    const plan = TIERS[tier as PaidTier];
    const orderId = `netthouse:${orgId}:${tier}:${crypto.randomUUID()}`;
    const response = await fetch(`${NOWPAYMENTS_API}/invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": requireNowPaymentsKey() },
      body: JSON.stringify({
        price_amount: plan.price,
        price_currency: "usd",
        pay_currency: NOWPAYMENTS_CURRENCY,
        order_id: orderId,
        order_description: `Netthouse ${plan.name} monthly plan for ${org.name}`,
        ipn_callback_url: webhookUrl(),
        success_url: `${process.env.WEB_URL ?? "https://app.netthouse.com"}/billing?success=true`,
        cancel_url: `${process.env.WEB_URL ?? "https://app.netthouse.com"}/billing?canceled=true`,
      }),
    });
    const data = await response.json() as { id?: string | number; invoice_url?: string; [key: string]: unknown };
    if (!response.ok || !data.invoice_url || data.id == null) {
      request.log.error({ status: response.status, data }, "NOWPayments invoice creation failed");
      return reply.status(502).send({ error: "Failed to create crypto checkout" });
    }

    const values = {
      orgId,
      tier: "free",
      provider: "nowpayments",
      providerPaymentId: String(data.id),
      providerOrderId: orderId,
      currency: "USD",
      amount: String(plan.price),
      status: "pending",
      updatedAt: new Date(),
    };
    const [existing] = await db.select().from(subscriptions).where(eq(subscriptions.orgId, orgId)).limit(1);
    if (existing) {
      await db.update(subscriptions).set(values).where(eq(subscriptions.orgId, orgId));
    } else {
      await db.insert(subscriptions).values(values);
    }
    return { url: data.invoice_url };
  });

  fastify.post("/webhooks/nowpayments", async (request, reply) => {
    const payload = request.body as Record<string, unknown>;
    const signature = request.headers["x-nowpayments-sig"];
    if (!verifySignature(payload, typeof signature === "string" ? signature : undefined)) {
      return reply.status(401).send({ error: "Invalid IPN signature" });
    }

    const paymentId = payload.payment_id == null ? null : String(payload.payment_id);
    const orderId = typeof payload.order_id === "string" ? payload.order_id : null;
    const status = typeof payload.payment_status === "string" ? payload.payment_status as PaymentStatus : null;
    const payCurrency = typeof payload.pay_currency === "string" ? payload.pay_currency.toLowerCase() : null;
    const priceAmount = Number(payload.price_amount);
    if (!paymentId || !orderId?.startsWith("netthouse:") || !status) {
      return reply.status(400).send({ error: "Invalid payment payload" });
    }

    const [, orgId, tier] = orderId.split(":");
    if (!orgId || (tier !== "pro" && tier !== "enterprise")) {
      return reply.status(400).send({ error: "Invalid Netthouse order" });
    }

    const [sub] = await db.select().from(subscriptions).where(
      or(eq(subscriptions.providerPaymentId, paymentId), eq(subscriptions.providerOrderId, orderId))
    ).limit(1);
    if (!sub) return reply.status(404).send({ error: "Subscription payment not found" });
    if (
      payCurrency !== NOWPAYMENTS_CURRENCY ||
      !Number.isFinite(priceAmount) ||
      Math.abs(priceAmount - Number(sub.amount)) > 0.01
    ) {
      return reply.status(400).send({ error: "Payment currency or amount does not match the order" });
    }

    const successful = status === "finished";
    const terminalFailure = status === "failed" || status === "refunded" || status === "expired";
    await db.update(subscriptions).set({
      provider: "nowpayments",
      providerPaymentId: paymentId,
      providerOrderId: orderId,
      status: successful ? "active" : terminalFailure ? status : "pending",
      tier: successful ? tier : sub.tier,
      currentPeriodEnd: successful ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : sub.currentPeriodEnd,
      updatedAt: new Date(),
    }).where(and(eq(subscriptions.id, sub.id), eq(subscriptions.providerOrderId, orderId)));

    return { received: true };
  });
}
