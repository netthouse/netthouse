"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

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
}: {
  userId: string;
  orgId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [entries, setEntries] = useState<EntryDraft[]>(emptyEntries());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ accounts: Account[] }>(userId, `/accounts?orgId=${orgId}`)
      .then((data) => {
        if (!cancelled) setAccounts(data.accounts);
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error).message);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, orgId]);

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
      setError("Description is required");
      return;
    }
    if (entries.length < 2) {
      setError("At least 2 entries are required");
      return;
    }
    for (const e of entries) {
      if (!e.accountId || !e.amount || Number(e.amount) <= 0) {
        setError("Each entry needs an account and a positive amount");
        return;
      }
    }
    if (!balanced) {
      setError(
        `Debits (${totals.debit.toFixed(2)}) must equal credits (${totals.credit.toFixed(2)})`
      );
      return;
    }

    startTransition(() => {
      apiFetch(userId, "/transactions", {
        method: "POST",
        body: JSON.stringify({ orgId, description, entries }),
      })
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
        You need at least 2 accounts in this organization to post a transaction.
      </div>
    );
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-sm"
      >
        + New transaction
      </button>

      {showForm && (
        <div className="mt-4 p-4 border border-slate-200 rounded-lg bg-white space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
              placeholder="e.g., Payment for services"
            />
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-500 uppercase">
              <div className="col-span-5">Account</div>
              <div className="col-span-3">Direction</div>
              <div className="col-span-3">Amount</div>
              <div className="col-span-1"></div>
            </div>
            {entries.map((entry, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <select
                  value={entry.accountId}
                  onChange={(e) => updateEntry(i, { accountId: e.target.value })}
                  className="col-span-5 px-2 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="">— select —</option>
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
                  className="col-span-3 px-2 py-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="debit">debit (−)</option>
                  <option value="credit">credit (+)</option>
                </select>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={entry.amount}
                  onChange={(e) => updateEntry(i, { amount: e.target.value })}
                  className="col-span-3 px-2 py-2 border border-slate-300 rounded-md text-sm"
                  placeholder="0.00"
                />
                <button
                  onClick={() => removeEntry(i)}
                  disabled={entries.length <= 2}
                  className="col-span-1 text-red-500 text-sm disabled:opacity-30"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <button onClick={addEntry} className="text-slate-600 hover:text-slate-900">
              + Add entry
            </button>
            <div className={balanced ? "text-green-600 font-medium" : "text-slate-500"}>
              Debit: {totals.debit.toFixed(2)} / Credit: {totals.credit.toFixed(2)}
              {balanced ? " ✓" : ""}
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-sm disabled:opacity-50"
            >
              {isPending ? "Posting..." : "Post transaction"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-300 rounded-md text-sm hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}