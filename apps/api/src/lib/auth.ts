import { verifyToken } from "@clerk/backend";
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
export async function requireClerkUser(req: FastifyRequest): Promise<string> {
  const authorization = req.headers.authorization;

  if (
    typeof authorization !== "string" ||
    !authorization.startsWith("Bearer ")
  ) {
    const err = new Error("Missing Clerk bearer token") as Error & {
      statusCode?: number;
    };
    err.statusCode = 401;
    throw err;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    const err = new Error("Empty Clerk bearer token") as Error & {
      statusCode?: number;
    };
    err.statusCode = 401;
    throw err;
  }

  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!secretKey) {
    const err = new Error("CLERK_SECRET_KEY is not configured") as Error & {
      statusCode?: number;
    };
    err.statusCode = 500;
    throw err;
  }

  try {
    const verifiedToken = await verifyToken(token, {
      secretKey,
      authorizedParties: [
        "https://app.netthouse.com",
        "https://netthouse.com",
        "https://www.netthouse.com",
        "http://localhost:3000",
      ],
    });

    if (!verifiedToken.sub) {
      throw new Error("Clerk token does not contain a user id");
    }

    return verifiedToken.sub;
  } catch {
    const err = new Error("Invalid or expired Clerk token") as Error & {
      statusCode?: number;
    };
    err.statusCode = 401;
    throw err;
  }
}
export async function requireOwnClerkOrg(
  req: FastifyRequest,
  orgId: string
) {
  const userId = await requireClerkUser(req);

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
