import { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import {
  postTransaction,
  getAccountBalance,
  db,
  ledgerTransactions,
  ledgerEntries,
  accounts,
  organizations,
} from "@netthouse/db";
import { requireUser, requireOwnOrg } from "../lib/auth.js";

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
  // POST /transactions — провести транзакцию (только в СВОЕЙ org)
  fastify.post("/transactions", async (request, reply) => {
    const parsed = createTransactionSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.issues });
    }
    await requireOwnOrg(request, parsed.data.orgId);

    try {
      const result = await postTransaction(parsed.data);
      return reply.status(201).send({ transaction: result.transaction, entries: result.entries });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Transaction failed";
      return reply.status(400).send({ error: message });
    }
  });

  // GET /transactions — список транзакций (только свои org)
  fastify.get("/transactions", async (request) => {
    const userId = requireUser(request);
    const { orgId } = request.query as { orgId?: string };

    // Находим все org пользователя
    const userOrgs = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.clerkUserId, userId));
    const userOrgIds = userOrgs.map((o) => o.id);

    if (userOrgIds.length === 0) return { transactions: [] };

    // Если передан orgId — проверяем принадлежность и фильтруем по нему
    let filterOrgIds = userOrgIds;
    if (orgId) {
      if (!userOrgIds.includes(orgId)) {
        const err = new Error("Organization not found or access denied") as Error & {
          statusCode?: number;
        };
        err.statusCode = 403;
        throw err;
      }
      filterOrgIds = [orgId];
    }

    const txs = await db
      .select()
      .from(ledgerTransactions)
      .where(inArray(ledgerTransactions.orgId, filterOrgIds));

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

  // GET /accounts/:id/balance — баланс (только свой счёт)
  fastify.get("/accounts/:id/balance", async (request) => {
    const { id } = request.params as { id: string };
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    if (!account) {
      const err = new Error("Account not found") as Error & { statusCode?: number };
      err.statusCode = 404;
      throw err;
    }
    await requireOwnOrg(request, account.orgId);
    const balance = await getAccountBalance(id);
    return { accountId: id, balance };
  });
}