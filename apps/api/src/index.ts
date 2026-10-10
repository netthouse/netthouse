import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { db } from "@netthouse/db";
import { organizations } from "@netthouse/db";
import { eq } from "drizzle-orm";
import agentRoutes from "./routes/agents.js";
import accountRoutes from "./routes/accounts.js";
import transactionRoutes from "./routes/transactions.js";
import premiumRoutes from "./routes/premium.js";
import clearingRoutes from "./routes/clearing.js";

const server = Fastify({ logger: true });

await server.register(cors, { origin: true });

const createOrgSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
});

server.get("/health", async () => {
  return { status: "ok", service: "netthouse-api", time: new Date().toISOString() };
});

server.get("/", async () => {
  return { name: "Netthouse API", version: "0.1.0" };
});

server.get("/organizations", async () => {
  const allOrgs = await db.select().from(organizations);
  return { organizations: allOrgs };
});

server.post("/organizations", async (request, reply) => {
  const parsed = createOrgSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: "Validation failed", details: parsed.error.issues });
  }

  const { name, slug } = parsed.data;

  const [newOrg] = await db
    .insert(organizations)
    .values({ name, slug })
    .returning();

  return reply.status(201).send({ organization: newOrg });
});

server.get("/organizations/:id", async (request) => {
  const { id } = request.params as { id: string };
  const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
  if (!org) {
    throw new Error("Organization not found");
  }
  return { organization: org };
});

await server.register(agentRoutes);
await server.register(accountRoutes);
await server.register(transactionRoutes);
await server.register(premiumRoutes);
await server.register(clearingRoutes);

const port = Number(process.env.API_PORT ?? 3001);
const host = process.env.API_HOST ?? "0.0.0.0";

try {
  await server.listen({ port, host });
  console.log(`🚀 Netthouse API running on http://${host}:${port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}