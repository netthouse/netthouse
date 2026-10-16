import { FastifyInstance } from "fastify";
import { proposeClearing } from "@netthouse/clearing";
import { requireUser, requireOwnOrg } from "../lib/auth.js";

export default async function clearingRoutes(fastify: FastifyInstance) {
  fastify.get("/clearing", async (request, reply) => {
    requireUser(request); // проверка авторизации
    const { orgId } = request.query as { orgId?: string };
    if (!orgId) {
      return reply.status(400).send({ error: "Query parameter orgId is required" });
    }
    // проверка: org принадлежит пользователю
    await requireOwnOrg(request, orgId);
    return await proposeClearing(orgId);
  });
}