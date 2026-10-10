import { FastifyInstance } from "fastify";
import { verifyPayment, createPaymentRequired } from "@netthouse/x402";

export default async function premiumRoutes(fastify: FastifyInstance) {
  fastify.get("/premium/data", async (request, reply) => {
    const { orgId } = request.query as { orgId?: string };
    if (!orgId) {
      return reply.status(400).send({ error: "Query parameter orgId is required" });
    }

    const paymentProof = request.headers["x-payment"] as string | undefined;

    if (!paymentProof) {
      return reply.status(402).send(
        createPaymentRequired({
          orgId,
          amount: "0.10",
          currency: "USD",
          description: "Premium data access",
        })
      );
    }

    const paid = await verifyPayment(orgId, paymentProof);
    if (!paid) {
      return reply.status(402).send({ error: "Invalid payment proof" });
    }

    return {
      data: "Premium market insights: AI agent payments grew 340% in 2026",
      pricePaid: "0.10 USD",
      paymentProof,
    };
  });
}