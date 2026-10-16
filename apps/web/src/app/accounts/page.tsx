import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import { apiFetch } from "@/lib/api";
import { getCurrentOrg } from "@/lib/org";

type Account = {
  id: string;
  orgId: string;
  currency: string;
  balance: string;
  createdAt: string;
};

export default async function AccountsPage() {
  const { userId } = await auth();
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const t = getDictionary(locale);

  if (!userId) {
    return <div className="p-8 text-slate-500">Not signed in</div>;
  }

    const currentOrg = await getCurrentOrg();
  if (!currentOrg) {
    return <div className="p-8 text-slate-500">No organizations yet</div>;
  }
  const data = await apiFetch<{ accounts: Account[] }>(
    userId,
    `/accounts?orgId=${currentOrg.id}`
  );
  const accounts = data.accounts;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{t.pages.accounts.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase">{acc.currency}</span>
              <span className="text-xs text-slate-400 font-mono">{acc.id.slice(0, 8)}...</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {Number(acc.balance).toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {t.pages.accounts.created} {new Date(acc.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}