import { FastifyInstance } from "fastify";
import { proposeClearing, applyClearing } from "@netthouse/clearing";
import { requireUser, requireOwnOrg } from "../lib/auth.js";

export default async function clearingRoutes(fastify: FastifyInstance) {
  // GET /clearing — показать предложения неттинга
  fastify.get("/clearing", async (request, reply) => {
    requireUser(request);
    const { orgId } = request.query as { orgId?: string };
    if (!orgId) {
      return reply.status(400).send({ error: "Query parameter orgId is required" });
    }
    await requireOwnOrg(request, orgId);
    return await proposeClearing(orgId);
  });

  // POST /clearing/apply — применить предложения (создать транзакции неттинга)
  fastify.post<{ Body: { orgId?: string } }>("/clearing/apply", async (request, reply) => {
    requireUser(request);
    const { orgId } = request.body ?? {};
    if (!orgId) {
      return reply.status(400).send({ error: "Body field orgId is required" });
    }
    await requireOwnOrg(request, orgId);

    try {
      const result = await applyClearing(orgId);
      return reply.status(201).send(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Apply clearing failed";
      return reply.status(400).send({ error: message });
    }
  });
}