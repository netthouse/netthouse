import { cookies } from "next/headers";
import type { Locale } from "@/i18n/dictionaries";
import OrganizationsClient from "@/components/OrganizationsClient";

export default async function OrganizationsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value ?? "en") as Locale;
  return <OrganizationsClient locale={locale} />;
}