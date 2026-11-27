"use client";

import { useEffect, useState, useTransition } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

type Account = {
  id: string;
  currency: string;
  balance: string;
};

type EntryDraft = {
  accountId: string;
  direction: "debit" | "credit";
  amount: string;
};

const emptyEntries = (): EntryDraft[] => [
  { accountId: "", direction: "debit", amount: "" },
  { accountId: "", direction: "credit", amount: "" },
];

export default function TransactionForm({
  userId,
  orgId,
  locale,
}: {
  userId: string;
  orgId: string;
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const { getToken } = useAuth();
  const tf = t.pages.transactions;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [entries, setEntries] = useState<EntryDraft[]>(emptyEntries());
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    let cancelled = false;

    const loadAccounts = async () => {
      try {
        const token = await getToken();
        const data = await apiFetch<{ accounts: Account[] }>(
          userId,
          `/accounts?orgId=${orgId}`,
          {},
          token
        );

        if (!cancelled) setAccounts(data.accounts);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    };

    void loadAccounts();

    return () => {
      cancelled = true;
    };
  }, [userId, orgId, getToken]);


  const updateEntry = (index: number, patch: Partial<EntryDraft>) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, ...patch } : e)));
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, { accountId: "", direction: "debit", amount: "" }]);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const totals = entries.reduce(
    (acc, e) => {
      const amt = Number(e.amount || 0);
      if (e.direction === "debit") acc.debit += amt;
      else acc.credit += amt;
      return acc;
    },
    { debit: 0, credit: 0 }
  );
  const balanced = totals.debit > 0 && Math.abs(totals.debit - totals.credit) < 0.000001;

  const handleSubmit = () => {
    setError(null);
    if (!description.trim()) {
      setError(tf.errDescription);
      return;
    }
    if (entries.length < 2) {
      setError(tf.errEntries);
      return;
    }
    for (const e of entries) {
      if (!e.accountId || !e.amount || Number(e.amount) <= 0) {
        setError(tf.errEntry);
        return;
      }
    }
    if (!balanced) {
      setError(
        locale === "ru"
          ? `Дебет (${totals.debit.toFixed(2)}) должен равняться кредиту (${totals.credit.toFixed(2)})`
          : `Debits (${totals.debit.toFixed(2)}) must equal credits (${totals.credit.toFixed(2)})`
      );
      return;
    }
        const submit = async () => {
      const token = await getToken();

      await apiFetch(userId, "/transactions", {
        method: "POST",
        body: JSON.stringify({ orgId, description, entries }),
      }, token);
    };

     startTransition(() => {
      submit()
        .then(() => {
          setDescription("");
          setEntries(emptyEntries());
          setShowForm(false);
          router.refresh();
        })
        .catch((err) => setError((err as Error).message));
    });
  };


  if (accounts.length < 2) {
    return (
      <div className="mb-6 p-4 border border-amber-300 bg-amber-50 rounded-lg text-sm text-amber-800">
        {tf.needAccounts}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 sm:w-auto"
      >
        {tf.newTransaction}
      </button>

      {showForm && (
        <div className="mt-4 space-y-4 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{tf.description}</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              placeholder={tf.descriptionPlaceholder}
            />
          </div>

          <div className="space-y-2">
            <div className="hidden grid-cols-12 gap-2 text-xs font-medium uppercase text-slate-500 md:grid">
              <div className="col-span-5">{tf.account}</div>
              <div className="col-span-3">{tf.direction}</div>
              <div className="col-span-3">{tf.amount}</div>
              <div className="col-span-1"></div>
            </div>
            {entries.map((entry, i) => (
              <div key={i} className="grid grid-cols-1 items-center gap-2 rounded-lg border border-slate-100 p-3 md:grid-cols-12 md:border-0 md:p-0">
                <select
                  value={entry.accountId}
                  onChange={(e) => updateEntry(i, { accountId: e.target.value })}
                  className="min-h-11 w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-5 md:px-2"
                >
                  <option value="">{tf.select}</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.currency} • {acc.id.slice(0, 8)}… ({Number(acc.balance).toFixed(2)})
                    </option>
                  ))}
                </select>
                <select
                  value={entry.direction}
                  onChange={(e) =>
                    updateEntry(i, { direction: e.target.value as "debit" | "credit" })
                  }
                  className="min-h-11 w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-3 md:px-2"
                >
                  <option value="debit">{tf.debitOption}</option>
                  <option value="credit">{tf.creditOption}</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={entry.amount}
                  onChange={(e) => updateEntry(i, { amount: e.target.value })}
                  className="min-h-11 w-full rounded-md border border-slate-300 px-3 py-2 text-sm md:col-span-3 md:px-2"
                  placeholder="0.00"
                />
                <button
                  onClick={() => removeEntry(i)}
                  disabled={entries.length <= 2}
                  className="min-h-11 w-full rounded-md text-sm text-red-600 hover:bg-red-50 disabled:opacity-30 md:col-span-1 md:w-auto"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <button onClick={addEntry} className="min-h-11 text-left text-slate-600 hover:text-slate-900">
              {tf.addEntry}
            </button>
            <div className={balanced ? "text-green-600 font-medium" : "text-slate-500"}>
              {tf.debit}: {totals.debit.toFixed(2)} / {tf.credit}: {totals.credit.toFixed(2)}
              {balanced ? " ✓" : ""}
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
            >
              {isPending ? tf.posting : tf.post}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="min-h-11 w-full rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 sm:w-auto"
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
