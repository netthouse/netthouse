import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import { apiFetch } from "@/lib/api";
import { getCurrentOrg } from "@/lib/org";
import CopyButton from "@/components/CopyButton";

type Account = {
  id: string;
  orgId: string;
  currency: string;
  balance: string;
  createdAt: string;
};

export default async function AccountsPage() {
  const { userId, getToken } = await auth();
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const t = getDictionary(locale);

 if (!userId) {
  return <div className="p-4 text-slate-500 sm:p-8">{t.common.notSignedIn}</div>;
}

const currentOrg = await getCurrentOrg();
if (!currentOrg) {
  return <div className="p-4 text-slate-500 sm:p-8">{t.common.noOrg}</div>;
}
const token = await getToken();
 const data = await apiFetch<{ accounts: Account[] }>(
  userId,
  `/accounts?orgId=${currentOrg.id}`,
  {},
  token
);

  const accounts = data.accounts;

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-5 text-2xl font-bold sm:mb-6">{t.pages.accounts.title}</h1>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((acc) => (
          <div key={acc.id} className="min-w-0 rounded-lg bg-white p-4 shadow sm:p-6">
            <div className="flex min-w-0 items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 uppercase">{acc.currency}</span>
              <span className="max-w-[45%] truncate font-mono text-xs text-slate-400" title={acc.id}>{acc.id.slice(0, 8)}...</span>
            </div>
            <p className="mt-2 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
              {Number(acc.balance).toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {t.pages.accounts.created} {new Date(acc.createdAt).toLocaleDateString()}
            </p>
            <CopyButton value={acc.id} locale={locale} className="mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
