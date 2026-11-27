import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentOrg } from "@/lib/org";
import ApiKeyManager from "@/components/ApiKeyManager";


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
  const { userId, getToken } = await auth();
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const t = getDictionary(locale);

  if (!userId) {
    return <div className="p-4 text-slate-500 sm:p-8">Not signed in</div>;
  }

  const currentOrg = await getCurrentOrg();
  const orgId = currentOrg?.id;
  let keys: ApiKeyRow[] = [];

  if (orgId) {
    const token = await getToken();

    const res = await fetch(`${API_URL}/api-keys?orgId=${orgId}`, {
  cache: "no-store",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

    if (res.ok) {
      const data = await res.json();
      keys = data.apiKeys;
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-5 text-2xl font-bold sm:mb-6">{t.pages.apiKeys.title}</h1>
       {orgId ? (
        <ApiKeyManager userId={userId} orgId={orgId} keys={keys} locale={locale as any} />
      ) : (
        <div className="rounded-lg bg-white p-5 text-sm text-slate-500 shadow sm:p-8">
          Select an organization to manage API keys
        </div>
      )}
    </div>
  );
}
