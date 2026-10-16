import { FastifyInstance } from "fastify";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import {
  createApiKey,
  listApiKeys,
  revokeApiKey,
  db,
  apiKeys,
  organizations,
  type ApiKeyScope,
} from "@netthouse/db";
import { requireAuth } from "../middleware/auth.js";

const createKeySchema = z.object({
  orgId: z.string().uuid(),
  name: z.string().min(1).max(200),
  scopes: z.array(z.enum(["read", "write", "transact", "admin"])).min(1),
});

async function userOwnsOrg(userId: string, orgId: string): Promise<boolean> {
  const [org] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(
      and(eq(organizations.id, orgId), eq(organizations.clerkUserId, userId))
    );
  return !!org;
}

// Доступ к org: либо ключ принадлежит этой org, либо это admin-ключ +
// запрос от пользователя (X-User-Id), который владеет org (путь дашборда)
async function canAccessOrg(request: any, orgId: string): Promise<boolean> {
  if (request.apiKey!.orgId === orgId) return true;
  const headerUserId = request.headers["x-user-id"] as string | undefined;
  const isAdmin = (request.apiKey!.scopes ?? []).includes("admin");
  if (!isAdmin || !headerUserId) return false;
  return await userOwnsOrg(headerUserId, orgId);
}

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

    if (!(await canAccessOrg(request, parsed.data.orgId))) {
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
    if (!(await canAccessOrg(request, orgId))) {
      throw { statusCode: 403, error: "Forbidden", message: "Wrong org" };
    }
    return { apiKeys: await listApiKeys(orgId) };
  });

  // DELETE /api-keys/:id - отозвать ключ
  fastify.delete("/api-keys/:id", async (request) => {
    const { id } = request.params as { id: string };
    const [keyRow] = await db.select().from(apiKeys).where(eq(apiKeys.id, id));
    if (!keyRow) {
      throw { statusCode: 404, error: "Not Found", message: "API key not found" };
    }
    if (!(await canAccessOrg(request, keyRow.orgId))) {
      throw { statusCode: 403, error: "Forbidden", message: "Cannot revoke key of another org" };
    }
    const revoked = await revokeApiKey(id);
    if (!revoked) {
      throw { statusCode: 404, error: "Not Found", message: "API key not found" };
    }
    return { revoked: true, keyId: id };
  });
}