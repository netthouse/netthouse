"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { getOrgsForUser } from "@/lib/org";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const ADMIN_KEY = process.env.API_ADMIN_KEY ?? "";

export async function setCurrentOrg(orgId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const orgs = await getOrgsForUser();
  const owned = orgs.find((o) => o.id === orgId);
  if (!owned) {
    throw new Error("Organization not found or access denied");
  }

  const cookieStore = await cookies();
  cookieStore.set("current_org_id", orgId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
}

export async function createApiKeyAction(payload: {
  orgId: string;
  name: string;
  scopes: string[];
}): Promise<{ key: string; name: string }> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  if (!ADMIN_KEY) throw new Error("API_ADMIN_KEY not configured on server");

  const owned = await getOrgsForUser();
  if (!owned.find((o) => o.id === payload.orgId)) {
    throw new Error("Organization not found or access denied");
  }

  const res = await fetch(`${API_URL}/api-keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_KEY}`,
      "X-User-Id": userId,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Create failed" }));
    throw new Error(err.error ?? "Create failed");
  }
  const data = await res.json();
  revalidatePath("/api-keys");
  return { key: data.apiKey.key, name: data.apiKey.name };
}

export async function revokeApiKeyAction(payload: {
  keyId: string;
  orgId: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  if (!ADMIN_KEY) throw new Error("API_ADMIN_KEY not configured on server");

  const owned = await getOrgsForUser();
  if (!owned.find((o) => o.id === payload.orgId)) {
    throw new Error("Organization not found or access denied");
  }

  const res = await fetch(`${API_URL}/api-keys/${payload.keyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${ADMIN_KEY}`,
      "X-User-Id": userId,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Revoke failed" }));
    throw new Error(err.error ?? "Revoke failed");
  }
  revalidatePath("/api-keys");
}