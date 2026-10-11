import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
  type ApiKeyScope,
} from "@netthouse/db";
import { requireAuth } from "../middleware/auth.js";

const createKeySchema = z.object({
  orgId: z.string().uuid(),
  name: z.string().min(1).max(200),
  scopes: z.array(z.enum(["read", "write", "transact", "admin"])).min(1),
});

export default async function apiKeyRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", async (request) => {
    await requireAuth(request, "admin");
  });

  // POST /api-keys - создать ключ
  fastify.post("/api-keys", async (request, reply) => {
    const parsed = createKeySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Validation failed", details: parsed.error.issues });
    }

    if (request.apiKey!.orgId !== parsed.data.orgId) {
      return reply.status(403).send({ error: "Cannot create key for another org" });
    }

    const key = await createApiKey(parsed.data);
    return reply.status(201).send({ apiKey: key });
  });

  // GET /api-keys - список ключей организации
  fastify.get("/api-keys", async (request) => {
    const { orgId } = request.query as { orgId?: string };
    if (!orgId) {
      throw { statusCode: 400, error: "Bad Request", message: "orgId required" };
    }
    if (request.apiKey!.orgId !== orgId) {
      throw { statusCode: 403, error: "Forbidden", message: "Wrong org" };
    }
    return { apiKeys: await listApiKeys(orgId) };
  });

  // DELETE /api-keys/:id - отозвать ключ
  fastify.delete("/api-keys/:id", async (request) => {
    const { id } = request.params as { id: string };
    const revoked = await revokeApiKey(id);
    if (!revoked) {
      throw { statusCode: 404, error: "Not Found", message: "API key not found" };
    }
    return { revoked: true, keyId: id };
  });
}