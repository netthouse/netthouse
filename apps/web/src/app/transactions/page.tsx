import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import { apiFetch } from "@/lib/api";
import { getCurrentOrg } from "@/lib/org";

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
  const data = await apiFetch<{ transactions: Transaction[] }>(
    userId,
    `/transactions?orgId=${currentOrg.id}`
  );
  const transactions = data.transactions;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{t.pages.transactions.title}</h1>
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-slate-500">{t.pages.transactions.empty}</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">{tx.description}</h2>
                <span className="text-xs text-slate-500">
                  {new Date(tx.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {tx.entries.map((e) => (
                  <div key={e.id} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs text-slate-500">
                      {e.accountId.slice(0, 8)}...
                    </span>
                    <span
                      className={`font-medium ${
                        e.direction === "debit" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {e.direction === "debit" ? "-" : "+"}
                      {Number(e.amount).toFixed(2)} {e.direction}
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