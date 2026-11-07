import { FastifyInstance } from "fastify";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db, subscriptions, organizations } from "@netthouse/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-10-28.endive",
});

// Тарифы
const TIERS = {
  free: { name: "Free", price: 0, commissionPercent: 10 },
  pro: { name: "Pro", price: 2900, commissionPercent: 5 },
  enterprise: { name: "Enterprise", price: 29900, commissionPercent: 2 },
};

export default async function billingRoutes(fastify: FastifyInstance) {
  // Получить текущую подписку org
  fastify.get("/billing/:orgId", async (request, reply) => {
    const { orgId } = request.params as { orgId: string };

    const sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.orgId, orgId))
      .limit(1);

    const subRow = sub[0];
    if (!subRow) {
      return { tier: "free", commissionPercent: 10, status: "active" };
    }

    const tier = subRow.tier as keyof typeof TIERS;
    return {
      tier: subRow.tier,
      commissionPercent: TIERS[tier]?.commissionPercent ?? 10,
      status: subRow.status,
      currentPeriodEnd: subRow.currentPeriodEnd,
    };
  });

  // Создать Stripe Checkout session
  fastify.post("/billing/checkout", async (request, reply) => {
    const { orgId, tier } = request.body as { orgId: string; tier: string };

    if (!TIERS[tier as keyof typeof TIERS]) {
      return reply.status(400).send({ error: "Invalid tier" });
    }

    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1);

    const orgRow = org[0];
    if (!orgRow) {
      return reply.status(404).send({ error: "Organization not found" });
    }

    // Создаём или получаем Stripe customer
    let sub = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.orgId, orgId))
      .limit(1);

    let customerId = sub[0]?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        name: orgRow.name,
        metadata: { orgId },
      });
      customerId = customer.id;

      if (sub.length === 0) {
        await db.insert(subscriptions).values({
          orgId,
          tier: "free",
          stripeCustomerId: customerId,
          status: "active",
        });
      } else {
        await db
          .update(subscriptions)
          .set({ stripeCustomerId: customerId })
          .where(eq(subscriptions.orgId, orgId));
      }
    }

    // Создаём Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Netthouse ${TIERS[tier as keyof typeof TIERS].name}`,
              description: `${TIERS[tier as keyof typeof TIERS].commissionPercent}% commission on payments`,
            },
            unit_amount: TIERS[tier as keyof typeof TIERS].price,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.WEB_URL ?? "http://localhost:3000"}/billing?success=true`,
      cancel_url: `${process.env.WEB_URL ?? "http://localhost:3000"}/billing?canceled=true`,
     metadata: { orgId, tier },
      subscription_data: {
        metadata: { orgId, tier },
      },
    });

        return { url: session.url };
  });

  // Stripe webhook (упрощённый, без проверки подписи для dev)
  fastify.post("/billing/webhook", async (request, reply) => {
    const event = request.body as Stripe.Event;

    switch (event.type) {
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const orgId = subscription.metadata?.orgId;
          const tier = subscription.metadata?.tier ?? "pro";

          if (orgId) {
            await db
              .update(subscriptions)
              .set({
                tier,
                stripeSubscriptionId: subscription.id,
                status: subscription.status,
                currentPeriodEnd: subscription.items?.data?.[0]?.current_period_end
                  ? new Date(subscription.items.data[0].current_period_end * 1000)
                  : null,
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.orgId, orgId));

            console.log(`✅ Updated subscription for org ${orgId}: tier=${tier}`);
          }
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const orgId = subscription.metadata?.orgId;
        const tier = subscription.metadata?.tier ?? "pro";

        if (orgId) {
          await db
            .update(subscriptions)
            .set({
              tier,
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              currentPeriodEnd: subscription.items?.data?.[0]?.current_period_end
                ? new Date(subscription.items.data[0].current_period_end * 1000)
                : null,
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.orgId, orgId));
          
          console.log(`✅ Updated subscription for org ${orgId}: tier=${tier}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const orgId = subscription.metadata?.orgId;

        if (orgId) {
          await db
            .update(subscriptions)
            .set({
              status: "canceled",
              tier: "free",
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.orgId, orgId));
          
          console.log(`⚠️ Canceled subscription for org ${orgId}`);
        }
        break;
      }
    }

    return { received: true };
  });
}