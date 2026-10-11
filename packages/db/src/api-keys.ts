import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "./index.js";
import { apiKeys } from "./schema.js";

export type ApiKeyScope = "read" | "write" | "transact" | "admin";

export function generateKeyString(): string {
  return "nt_" + randomBytes(32).toString("hex");
}

export async function createApiKey(input: {
  orgId: string;
  name: string;
  scopes: ApiKeyScope[];
}) {
  const key = generateKeyString();
  const [created] = await db
    .insert(apiKeys)
    .values({
      orgId: input.orgId,
      name: input.name,
      key,
      scopes: input.scopes,
    })
    .returning();

  return { ...created, key };
}

export async function validateApiKey(keyString: string) {
  if (!keyString) return null;

  const [found] = await db.select().from(apiKeys).where(eq(apiKeys.key, keyString));

  if (!found) return null;
  if (!found.isActive) return null;

  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, found.id));

  return found;
}

export function hasScope(apiKey: { scopes: unknown }, required: ApiKeyScope): boolean {
  const scopes = Array.isArray(apiKey.scopes) ? apiKey.scopes : [];
  if (scopes.includes("admin")) return true;
  return scopes.includes(required);
}

export async function listApiKeys(orgId: string) {
  const rows = await db.select().from(apiKeys).where(eq(apiKeys.orgId, orgId));
  return rows.map(({ key, ...rest }) => ({
    ...rest,
    keyPreview: key.slice(0, 10) + "..." + key.slice(-6),
  }));
}

export async function revokeApiKey(id: string) {
  const [updated] = await db
    .update(apiKeys)
    .set({ isActive: false })
    .where(eq(apiKeys.id, id))
    .returning();
  return updated;
}