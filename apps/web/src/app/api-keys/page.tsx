import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentOrg } from "@/lib/org";
import ApiKeyManager from "@/components/ApiKeyManager";

const ADMIN_KEY = process.env.API_ADMIN_KEY ?? "";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type ApiKeyRow = {
  id: string;
  name: string;
  scopes: string[];
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
  keyPreview: string;
};

export default async function ApiKeysPage() {
  const { userId } = await auth();
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const t = getDictionary(locale);

  if (!userId) {
    return <div className="p-8 text-slate-500">Not signed in</div>;
  }

  const currentOrg = await getCurrentOrg();
  const orgId = currentOrg?.id;
  let keys: ApiKeyRow[] = [];

  if (orgId) {
    const res = await fetch(`${API_URL}/api-keys?orgId=${orgId}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${ADMIN_KEY}`,
        "X-User-Id": userId,
      },
    });
    if (res.ok) {
      const data = await res.json();
      keys = data.apiKeys;
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{t.pages.apiKeys.title}</h1>
       {orgId ? (
        <ApiKeyManager userId={userId} orgId={orgId} keys={keys} locale={locale as any} />
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-slate-500">
          Select an organization to manage API keys
        </div>
      )}
    </div>
  );
}