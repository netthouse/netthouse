import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db, getAccountBalance } from "@netthouse/db";
import { accounts, organizations } from "@netthouse/db";
import { eq, and } from "drizzle-orm";
import { requireUser, requireOwnOrg } from "../lib/auth.js";

const createAccountSchema = z.object({
  orgId: z.string().uuid(),
  agentId: z.string().uuid().optional(),
  currency: z.string().length(3).default("USD"),
  balance: z.string().optional().default("0"),
});

export default async function accountRoutes(fastify: FastifyInstance) {
  
     // GET /accounts — список счетов пользователя (опционально по одной org)
  fastify.get("/accounts", async (request) => {
    const userId = requireUser(request);
    const { orgId } = request.query as { orgId?: string };

    const attachBalance = async (rows: any[]) =>
      Promise.all(
        rows.map(async (acc) => ({
          ...acc,
          balance: await getAccountBalance(acc.id),
        }))
      );

    if (orgId) {
      await requireOwnOrg(request, orgId);
      const rows = await db.select().from(accounts).where(eq(accounts.orgId, orgId));
      return { accounts: await attachBalance(rows) };
    }

    const rows = await db
      .select({
        id: accounts.id,
        orgId: accounts.orgId,
        agentId: accounts.agentId,
        currency: accounts.currency,
        createdAt: accounts.createdAt,
      })
      .from(accounts)
      .innerJoin(organizations, eq(accounts.orgId, organizations.id))
      .where(eq(organizations.clerkUserId, userId));
    return { accounts: await attachBalance(rows) };
  });

  // POST /accounts — создать счёт в СВОЕЙ организации
  fastify.post("/accounts", async (request, reply) => {
    const parsed = createAccountSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.issues });
    }
    const { orgId, agentId, currency, balance } = parsed.data;

    // проверка: org принадлежит пользователю
    await requireOwnOrg(request, orgId);

    const [newAccount] = await db
      .insert(accounts)
      .values({ orgId, agentId, currency, balance })
      .returning();

    return reply.status(201).send({ account: newAccount });
  });

  // GET /accounts/:id — получить один счёт (только свой)
  fastify.get("/accounts/:id", async (request) => {
    const { id } = request.params as { id: string };
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    if (!account) {
      const err = new Error("Account not found") as Error & { statusCode?: number };
      err.statusCode = 404;
      throw err;
    }
    // проверка: org этого счёта принадлежит пользователю
    await requireOwnOrg(request, account.orgId);
    return { account };
  });
}