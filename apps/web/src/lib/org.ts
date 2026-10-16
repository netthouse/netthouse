import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { apiFetch } from "@/lib/api";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  clerkUserId: string;
};

export async function getOrgsForUser(): Promise<Organization[]> {
  const { userId } = await auth();
  if (!userId) return [];
  
  const data = await apiFetch<{ organizations: Organization[] }>(
    userId,
    "/organizations"
  );
  return data.organizations;
}

export async function getCurrentOrg(): Promise<Organization | null> {
  const cookieStore = await cookies();
  const currentOrgId = cookieStore.get("current_org_id")?.value;
  const orgs = await getOrgsForUser();
  
  if (orgs.length === 0) return null;
  
  // если есть cookie и org существует — возвращаем её
  if (currentOrgId) {
    const found = orgs.find((o) => o.id === currentOrgId);
    if (found) return found;
  }
  
  // fallback: первая организация
  return orgs[0];
}