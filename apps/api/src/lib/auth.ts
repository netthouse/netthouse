import type { FastifyRequest } from "fastify";
import { db } from "@netthouse/db";
import { organizations } from "@netthouse/db";
import { eq } from "drizzle-orm";

export function getUserId(req: FastifyRequest): string | null {
  const v = req.headers["x-user-id"];
  if (typeof v === "string" && v.startsWith("user_")) return v;
  if (Array.isArray(v) && typeof v[0] === "string" && v[0].startsWith("user_")) return v[0];
  return null;
}

export function requireUser(req: FastifyRequest): string {
  const userId = getUserId(req);
  if (!userId) {
    const err = new Error("Missing or invalid X-User-Id header") as Error & {
      statusCode?: number;
    };
    err.statusCode = 401;
    throw err;
  }
  return userId;
}

export async function requireOwnOrg(req: FastifyRequest, orgId: string) {
  const userId = requireUser(req);
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);
  if (!org || org.clerkUserId !== userId) {
    const err = new Error("Organization not found or access denied") as Error & {
      statusCode?: number;
    };
    err.statusCode = 404;
    throw err;
  }
  return org;
}