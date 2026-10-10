import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "@netthouse/db";
import { accounts } from "@netthouse/db";
import { eq } from "drizzle-orm";

const createAccountSchema = z.object({
  orgId: z.string().uuid(),
  agentId: z.string().uuid().optional(),
  currency: z.string().length(3).default("USD"),
  balance: z.string().optional().default("0"),
});

export default async function accountRoutes(fastify: FastifyInstance) {
  // GET /accounts - список всех счетов
  fastify.get("/accounts", async () => {
    const allAccounts = await db.select().from(accounts);
    return { accounts: allAccounts };
  });

  // POST /accounts - создать счёт
  fastify.post("/accounts", async (request, reply) => {
    const parsed = createAccountSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.issues });
    }

    const { orgId, agentId, currency, balance } = parsed.data;

    const [newAccount] = await db
      .insert(accounts)
      .values({ orgId, agentId, currency, balance })
      .returning();

    return reply.status(201).send({ account: newAccount });
  });

  // GET /accounts/:id - получить один счёт
  fastify.get("/accounts/:id", async (request) => {
    const { id } = request.params as { id: string };
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    if (!account) {
      throw new Error("Account not found");
    }
    return { account };
  });
}