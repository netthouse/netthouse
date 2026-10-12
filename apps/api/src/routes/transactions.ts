import { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { postTransaction, getAccountBalance, db, ledgerTransactions, ledgerEntries } from "@netthouse/db";

const transactionEntrySchema = z.object({
  accountId: z.string().uuid(),
  direction: z.enum(["debit", "credit"]),
  amount: z.string().regex(/^\d+(\.\d+)?$/),
});

const createTransactionSchema = z.object({
  orgId: z.string().uuid(),
  description: z.string().min(1).max(500),
  entries: z.array(transactionEntrySchema).min(2),
});

export default async function transactionRoutes(fastify: FastifyInstance) {
  // POST /transactions - провести транзакцию двойной записи
  fastify.post("/transactions", async (request, reply) => {
    const parsed = createTransactionSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.issues });
    }

    try {
      const result = await postTransaction(parsed.data);
      return reply.status(201).send({ transaction: result.transaction, entries: result.entries });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Transaction failed";
      return reply.status(400).send({ error: message });
    }
  });

  // GET /transactions - список транзакций с проводками
  fastify.get("/transactions", async (request) => {
    const { orgId } = request.query as { orgId?: string };
    const txs = orgId
      ? await db.select().from(ledgerTransactions).where(eq(ledgerTransactions.orgId, orgId))
      : await db.select().from(ledgerTransactions);

    if (txs.length === 0) return { transactions: [] };

    const entries = await db
      .select()
      .from(ledgerEntries)
      .where(inArray(ledgerEntries.transactionId, txs.map((t) => t.id)));

    const byTx = new Map<string, typeof entries>();
    for (const e of entries) {
      const arr = byTx.get(e.transactionId) ?? [];
      arr.push(e);
      byTx.set(e.transactionId, arr);
    }

    return {
      transactions: txs.map((t) => ({ ...t, entries: byTx.get(t.id) ?? [] })),
    };
  });

  // GET /accounts/:id/balance - получить баланс счёта
  fastify.get("/accounts/:id/balance", async (request) => {
    const { id } = request.params as { id: string };
    const balance = await getAccountBalance(id);
    return { accountId: id, balance };
  });
}