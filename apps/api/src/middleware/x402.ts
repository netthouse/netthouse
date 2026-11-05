import { FastifyRequest, FastifyReply } from "fastify";
import { exact } from "x402/schemes";
import type { PaymentRequirements } from "x402/types";
import { db, x402Payments, organizations, subscriptions } from "@netthouse/db";
import { eq } from "drizzle-orm";
import { organizations } from "@netthouse/db";
import * as facilitator from "../facilitator/index.js";

// USDC адреса для разных сетей
const USDC_ADDRESSES: Record<string, string> = {
  "base-sepolia": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  "base": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
};

// Поддерживаемые сети (подмножество union-типа Network из x402)
const SUPPORTED_NETWORKS = ["base-sepolia", "base"] as const;
type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number];

const rawNetwork = process.env.X402_NETWORK ?? "base-sepolia";
const NETWORK: SupportedNetwork = (
  SUPPORTED_NETWORKS as readonly string[]
).includes(rawNetwork)
  ? (rawNetwork as SupportedNetwork)
  : "base-sepolia";
const SELLER_ADDRESS = process.env.X402_SELLER_ADDRESS as string;
const USDC_ADDRESS =
  process.env.X402_USDC_ADDRESS ?? USDC_ADDRESSES[NETWORK] ?? "";

if (!SELLER_ADDRESS) {
  throw new Error("X402_SELLER_ADDRESS must be set in .env");
}

if (!USDC_ADDRESS) {
  throw new Error(`USDC address not found for network "${NETWORK}"`);
}

if (!SELLER_ADDRESS) {
  throw new Error("X402_SELLER_ADDRESS must be set in .env");
}


export interface X402Config {
  amount: string;
  description: string;
  orgId?: string;
}

export function buildRequirements(
  resource: string,
  config: X402Config
): PaymentRequirements {
  return {
    scheme: "exact",
    network: NETWORK,
    payTo: SELLER_ADDRESS,
    maxAmountRequired: config.amount,
    resource,
    description: config.description,
    mimeType: "application/json",
    maxTimeoutSeconds: 60,
    asset: USDC_ADDRESS,
       extra: {
      name: NETWORK === "base" ? "USD Coin" : "USDC",
      version: "2",
    },
  };
}
export async function x402Middleware(
  request: FastifyRequest,
  reply: FastifyReply,
  config: X402Config
): Promise<boolean> {
    // Проверяем что организация не suspended
  if (config.orgId) {
    const org = await db
      .select({ isSuspended: organizations.isSuspended })
      .from(organizations)
      .where(eq(organizations.id, config.orgId))
      .limit(1);

    if (org.length > 0 && org[0].isSuspended) {
      reply.status(403).send({
        error: "Organization suspended",
        message: "This seller is temporarily suspended and cannot accept payments",
      });
      return false;
    }
  }

  const paymentHeader = request.headers["x-payment"] as string | undefined;

  const requirements = buildRequirements(request.url, config);

  if (!paymentHeader) {
    reply
      .status(402)
      .header("X-PAYMENT-REQUIREMENTS", JSON.stringify(requirements))
      .send({
        error: "Payment required",
        message: "Please provide X-PAYMENT header",
        requirements,
      });
    return false;
  }

  try {
    const payload = exact.evm.decodePayment(paymentHeader);
    // Сужаем union-тип payload до EVM-варианта (Base Sepolia)
    const evmPayload = payload.payload as {
      authorization: { from: string; to: string; value: string };
    };

    // Верификация подписи через facilitator
    const verification = await facilitator.verify(payload, requirements);

    if (!verification.isValid) {
      reply.status(402).send({
        error: "Invalid payment",
        reason: verification.invalidReason,
      });
      return false;
    }

    // Проведение платежа через facilitator (он сам платит газ)
    const settleResponse = await facilitator.settle(payload, requirements);

    if (!settleResponse.success) {
      reply.status(402).send({
        error: "Settlement failed",
        reason: settleResponse.errorReason,
      });
      return false;
    }

        const txHash = settleResponse.transaction ?? "";

    // Расчёт комиссии по тарифу организации (Free=10%, Pro=5%, Enterprise=2%)
    let feePercent = BigInt(10);
    if (config.orgId) {
      const sub = await db
        .select({ tier: subscriptions.tier })
        .from(subscriptions)
        .where(eq(subscriptions.orgId, config.orgId))
        .limit(1);
      const tier = sub[0]?.tier ?? "free";
      if (tier === "pro") feePercent = BigInt(5);
      else if (tier === "enterprise") feePercent = BigInt(2);
    }

    const totalAmount = BigInt(config.amount);
    const feeAmount = (totalAmount * feePercent) / BigInt(100);
    const sellerAmount = totalAmount - feeAmount;

    // Записываем платёж в БД
    try {
      await db.insert(x402Payments).values({
        orgId: config.orgId ?? null,
        txHash,
        fromAddress: evmPayload.authorization.from,
        toAddress: requirements.payTo,
        amount: config.amount,
        feeAmount: feeAmount.toString(),
        feeAddress: process.env.NETTHOUSE_FEE_ADDRESS ?? "",
        sellerAmount: sellerAmount.toString(),
        network: NETWORK,
        resource: requirements.resource,
        description: config.description,
      });
    } catch (err) {
      console.error("Failed to persist x402 payment:", err);
    }

    (request as any).x402Payment = {
      payload,
      txHash,
      amount: config.amount,
      fromAddress: evmPayload.authorization.from,
    };

    return true;
  } catch (err) {
    reply.status(402).send({
      error: "Payment verification failed",
      message: err instanceof Error ? err.message : "Unknown error",
    });
    return false;
  }
}