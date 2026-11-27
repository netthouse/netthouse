import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import { apiFetch } from "@/lib/api";
import { getCurrentOrg } from "@/lib/org";
import TransactionForm from "@/components/TransactionForm";

type Entry = {
  id: string;
  accountId: string;
  direction: "debit" | "credit";
  amount: string;
};

type Transaction = {
  id: string;
  description: string;
  createdAt: string;
  entries: Entry[];
};

export default async function TransactionsPage() {
  const { userId, getToken } = await auth();
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const t = getDictionary(locale);

  if (!userId) {
    return <div className="p-4 text-slate-500 sm:p-8">Not signed in</div>;
  }

  const currentOrg = await getCurrentOrg();
  if (!currentOrg) {
    return <div className="p-4 text-slate-500 sm:p-8">No organizations yet</div>;
  }
  const token = await getToken();
  const data = await apiFetch<{ transactions: Transaction[] }>(
  userId,
  `/transactions?orgId=${currentOrg.id}`,
  {},
  token
);

  const transactions = data.transactions;

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-5 text-2xl font-bold sm:mb-6">{t.pages.transactions.title}</h1>

      <TransactionForm userId={userId} orgId={currentOrg.id} locale={locale as any} />

      <div className="space-y-3 sm:space-y-4">
        {transactions.length === 0 ? (
          <p className="text-slate-500">{t.pages.transactions.empty}</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="min-w-0 rounded-lg bg-white p-4 shadow sm:p-6">
              <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="break-words text-sm font-semibold text-slate-900">{tx.description}</h2>
                <span className="text-xs text-slate-500 sm:shrink-0">
                  {new Date(tx.createdAt).toLocaleString(locale)}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {tx.entries.map((e) => (
                  <div key={e.id} className="flex min-w-0 items-center justify-between gap-3 text-sm">
                    <span className="truncate font-mono text-xs text-slate-500" title={e.accountId}>
                      {e.accountId.slice(0, 8)}...
                    </span>
                     <span
                      className={`font-medium ${
                        e.direction === "debit" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {e.direction === "debit" ? "-" : "+"}
                      {Number(e.amount).toFixed(2)}{" "}
                      {e.direction === "debit"
                        ? t.pages.transactions.debit
                        : t.pages.transactions.credit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
