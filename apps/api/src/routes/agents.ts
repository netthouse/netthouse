import { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "@netthouse/db";
import { agents } from "@netthouse/db";
import { eq } from "drizzle-orm";

const createAgentSchema = z.object({
  orgId: z.string().uuid(),
  name: z.string().min(1).max(200),
  status: z.string().optional().default("active"),
});

export default async function agentRoutes(fastify: FastifyInstance) {
  // GET /agents - список всех агентов
  fastify.get("/agents", async () => {
    const allAgents = await db.select().from(agents);
    return { agents: allAgents };
  });

  // POST /agents - создать агента
  fastify.post("/agents", async (request, reply) => {
    const parsed = createAgentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.issues });
    }

    const { orgId, name, status } = parsed.data;

    const [newAgent] = await db
      .insert(agents)
      .values({ orgId, name, status })
      .returning();

    return reply.status(201).send({ agent: newAgent });
  });

  // GET /agents/:id - получить одного агента
  fastify.get("/agents/:id", async (request) => {
    const { id } = request.params as { id: string };
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    if (!agent) {
      throw new Error("Agent not found");
    }
    return { agent };
  });
}