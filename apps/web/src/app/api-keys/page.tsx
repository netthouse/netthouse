import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import { apiFetch } from "@/lib/api";
import { getCurrentOrg } from "@/lib/org";

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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t.pages.apiKeys.name}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t.pages.apiKeys.key}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t.pages.apiKeys.scopes}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t.pages.apiKeys.status}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t.pages.apiKeys.lastUsed}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {keys.map((k) => (
              <tr key={k.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{k.name}</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-600">{k.keyPreview}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {k.scopes.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      k.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {k.isActive ? t.pages.apiKeys.active : t.pages.apiKeys.revoked}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString() : t.pages.apiKeys.never}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}