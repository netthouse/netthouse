import { FastifyInstance } from "fastify";
import { and, eq, isNull, or, sql } from "drizzle-orm";
import { db, x402Payments } from "@netthouse/db";
import { requireAuth } from "../middleware/auth.js";

export default async function paymentRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", async (request) => {
    await requireAuth(request, "admin");
  });

  fastify.get("/payments", async (request) => {
    const { orgId } = request.query as { orgId?: string };
    if (!orgId) {
      throw { statusCode: 400, error: "Bad Request", message: "orgId required" };
    }

    const rows = await db
      .select({
        tx_hash: x402Payments.txHash,
        from_address: x402Payments.fromAddress,
        amount: x402Payments.amount,
        resource: x402Payments.resource,
        created_at: x402Payments.createdAt,
      })
      .from(x402Payments)
      .where(or(eq(x402Payments.orgId, orgId), isNull(x402Payments.orgId)))
      .orderBy(sql`${x402Payments.createdAt} DESC`)
      .limit(100);

    return { payments: rows };
  });
}