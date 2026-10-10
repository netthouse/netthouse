import { FastifyInstance } from "fastify";
import { proposeClearing } from "@netthouse/clearing";

export default async function clearingRoutes(fastify: FastifyInstance) {
  fastify.get("/clearing", async (request, reply) => {
    const { orgId } = request.query as { orgId?: string };
    if (!orgId) {
      return reply.status(400).send({ error: "Query parameter orgId is required" });
    }
    return await proposeClearing(orgId);
  });
}