import { FastifyRequest } from "fastify";
import { validateApiKey, hasScope, type ApiKeyScope } from "@netthouse/db";

declare module "fastify" {
  interface FastifyRequest {
    apiKey?: {
      id: string;
      orgId: string;
      name: string;
      scopes: ApiKeyScope[];
    };
  }
}

export async function requireAuth(
  request: FastifyRequest,
  requiredScope?: ApiKeyScope
) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw { statusCode: 401, error: "Unauthorized", message: "Missing Bearer token" };
  }

  const token = authHeader.slice(7);
  const apiKey = await validateApiKey(token);
  if (!apiKey) {
    throw { statusCode: 401, error: "Unauthorized", message: "Invalid or revoked API key" };
  }

  if (requiredScope && !hasScope(apiKey, requiredScope)) {
    throw { statusCode: 403, error: "Forbidden", message: `Scope "${requiredScope}" required` };
  }

  request.apiKey = {
    id: apiKey.id,
    orgId: apiKey.orgId,
    name: apiKey.name,
    scopes: apiKey.scopes as ApiKeyScope[],
  };
}