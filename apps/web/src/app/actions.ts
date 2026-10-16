"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { getOrgsForUser } from "@/lib/org";

export async function setCurrentOrg(orgId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Not authenticated");
  }

  // проверка: org действительно принадлежит пользователю
  const orgs = await getOrgsForUser();
  const owned = orgs.find((o) => o.id === orgId);
  if (!owned) {
    throw new Error("Organization not found or access denied");
  }

  const cookieStore = await cookies();
  cookieStore.set("current_org_id", orgId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 дней
    httpOnly: true,
    sameSite: "lax",
  });

  // обновляем все страницы дашборда
  revalidatePath("/", "layout");
}