import { FastifyInstance } from "fastify";
import { and, eq, sql } from "drizzle-orm";
import { db, x402Payments } from "@netthouse/db";
import { requireAuth } from "../middleware/auth.js";

export default async function commissionRoutes(fastify: FastifyInstance) {
  // GET /commission/:sellerAddress — публичный, возвращает долг продавца
  fastify.get<{ Params: { sellerAddress: string } }>(
    "/commission/:sellerAddress",
    async (request) => {
      const { sellerAddress } = request.params;

      const rows = await db
        .select({
          tx_hash: x402Payments.txHash,
          from_address: x402Payments.fromAddress,
          amount: x402Payments.amount,
          fee_amount: x402Payments.feeAmount,
          resource: x402Payments.resource,
          created_at: x402Payments.createdAt,
        })
        .from(x402Payments)
        .where(
          and(
            sql`LOWER(${x402Payments.toAddress}) = LOWER(${sellerAddress})`,
            eq(x402Payments.commissionPaid, false)
          )
        )
        .orderBy(sql`${x402Payments.createdAt} DESC`)
        .limit(100);

      const totalUnpaid = rows.reduce(
        (sum, r) => sum + Number(r.fee_amount ?? 0),
        0
      );

      return {
        sellerAddress,
        totalUnpaid: totalUnpaid.toFixed(6),
        count: rows.length,
        transactions: rows,
      };
    }
  );

  // POST /commission/mark-paid — помечает как оплаченное (требует admin scope)
  fastify.post<{ Body: { sellerAddress: string; paymentTxHash: string } }>(
    "/commission/mark-paid",
    async (request, reply) => {
      await requireAuth(request, "admin");
      const { sellerAddress, paymentTxHash } = request.body ?? {};

      if (!sellerAddress || !paymentTxHash) {
        return reply.status(400).send({ error: "sellerAddress and paymentTxHash required" });
      }

      const result = await db
        .update(x402Payments)
        .set({
          commissionPaid: true,
          commissionPaidAt: new Date(),
          commissionPaidTxHash: paymentTxHash,
        })
        .where(
          and(
            sql`LOWER(${x402Payments.toAddress}) = LOWER(${sellerAddress})`,
            eq(x402Payments.commissionPaid, false)
          )
        )
        .returning();

      return { updated: result.length, txHashes: result.map((r) => r.txHash) };
    }
  );
}