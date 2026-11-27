"use client";

import { useState, useTransition } from "react";
import { createApiKeyAction, revokeApiKeyAction } from "@/app/actions";
import { getDictionary, type Locale } from "@/i18n/dictionaries";

type ApiKeyRow = {
  id: string;
  name: string;
  scopes: string[];
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string | null;
  keyPreview: string;
};

const AVAILABLE_SCOPES = ["read", "write", "transact", "admin"] as const;

export default function ApiKeyManager({
  userId,
  orgId,
  keys,
  locale,
}: {
  userId: string;
  orgId: string;
  keys: ApiKeyRow[];
  locale: Locale;
}) {
  const t = getDictionary(locale);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["read"]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

  const toggleScope = (s: string) => {
    setSelectedScopes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleCreate = () => {
    setError(null);
    if (!name.trim()) {
      setError(t.pages.apiKeys.nameRequired);
      return;
    }
    if (selectedScopes.length === 0) {
      setError(t.pages.apiKeys.selectScope);
      return;
    }
    startTransition(() => {
      createApiKeyAction({ orgId, name: name.trim(), scopes: selectedScopes })
        .then((data) => {
          setNewKey(data.key);
          setName("");
          setSelectedScopes(["read"]);
          setShowForm(false);
        })
        .catch((err) => setError((err as Error).message));
    });
  };

  const handleRevoke = (keyId: string) => {
    setConfirmRevoke(keyId);
  };

  const confirmRevokeAction = () => {
    if (!confirmRevoke) return;
    startTransition(() => {
      revokeApiKeyAction({ keyId: confirmRevoke, orgId })
        .then(() => setConfirmRevoke(null))
        .catch((err) => {
          setError((err as Error).message);
          setConfirmRevoke(null);
        });
    });
  };

  const copyKey = async () => {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {newKey && (
        <div className="rounded-lg border border-green-300 bg-green-50 p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 text-xs font-bold text-green-800">API</div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-2">
                {t.pages.apiKeys.createSuccess}
              </h3>
              <p className="text-sm text-green-800 mb-3">
                <strong>{t.pages.apiKeys.saveNow}</strong>
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  readOnly
                  value={newKey}
                  className="min-h-11 min-w-0 w-full flex-1 rounded-md border border-green-400 bg-white px-3 py-2 font-mono text-xs sm:text-sm"
                />
                <button
                  onClick={copyKey}
                  className="min-h-11 w-full rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 sm:w-auto"
                >
                  {copied ? t.common.copied : t.common.copy}
                </button>
                <button
                  onClick={() => setNewKey(null)}
                  className="min-h-11 w-full rounded-md border border-green-400 px-4 py-2 text-sm text-green-800 hover:bg-green-100 sm:w-auto"
                >
                  {t.common.dismiss}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmRevoke && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div role="dialog" aria-modal="true" className="w-full rounded-t-2xl bg-white p-5 shadow-xl sm:max-w-md sm:rounded-lg sm:p-6">
            <h3 className="text-lg font-semibold mb-2">{t.pages.apiKeys.revokeTitle}</h3>
            <p className="text-sm text-slate-600 mb-4">
              {t.pages.apiKeys.revokeConfirm}
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setConfirmRevoke(null)}
                className="min-h-11 w-full rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 sm:w-auto"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={confirmRevokeAction}
                disabled={isPending}
                className="min-h-11 w-full rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50 sm:w-auto"
              >
                {isPending ? t.common.revoking : t.pages.apiKeys.revoke}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        {!showForm && !newKey && (
          <button
            onClick={() => setShowForm(true)}
            className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 sm:w-auto"
          >
            {t.pages.apiKeys.createKey}
          </button>
        )}

        {showForm && (
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                {t.pages.apiKeys.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-h-11 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder={t.pages.apiKeys.namePlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">
                {t.pages.apiKeys.scopes}
              </label>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_SCOPES.map((s) => (
                  <label key={s} className="flex min-h-11 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedScopes.includes(s)}
                      onChange={() => toggleScope(s)}
                    />
                    <span className="capitalize">{s}</span>
                  </label>
                ))}
              </div>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleCreate}
                disabled={isPending}
                className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
              >
                {isPending ? t.common.creating : t.common.create}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
                className="min-h-11 w-full rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 sm:w-auto"
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 md:hidden">
        {keys.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center text-sm text-slate-500 shadow">
            {t.pages.apiKeys.noKeys}
          </div>
        ) : keys.map((key) => (
          <article key={key.id} className="min-w-0 rounded-lg bg-white p-4 shadow">
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 break-words font-semibold text-slate-900">{key.name}</h3>
              <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${key.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {key.isActive ? t.pages.apiKeys.active : t.pages.apiKeys.revoked}
              </span>
            </div>
            <p className="mt-2 break-all font-mono text-xs text-slate-600">{key.keyPreview}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {key.scopes.map((scope) => (
                <span key={scope} className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">{scope}</span>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {t.pages.apiKeys.lastUsed}: {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString(locale) : t.pages.apiKeys.never}
            </p>
            {key.isActive && (
              <button onClick={() => handleRevoke(key.id)} className="mt-3 min-h-11 w-full rounded-md border border-red-200 px-3 text-sm font-medium text-red-700 hover:bg-red-50">
                {t.pages.apiKeys.revoke}
              </button>
            )}
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg bg-white shadow md:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                {t.pages.apiKeys.name}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                {t.pages.apiKeys.key}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                {t.pages.apiKeys.scopes}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                {t.pages.apiKeys.status}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                {t.pages.apiKeys.lastUsed}
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {keys.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  {t.pages.apiKeys.noKeys}
                </td>
              </tr>
            ) : (
              keys.map((k) => (
                <tr key={k.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {k.name}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">
                    {k.keyPreview}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        k.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {k.isActive ? t.pages.apiKeys.active : t.pages.apiKeys.revoked}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {k.lastUsedAt
                      ? new Date(k.lastUsedAt).toLocaleString(locale)
                      : t.pages.apiKeys.never}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {k.isActive && (
                      <button
                        onClick={() => handleRevoke(k.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        {t.pages.apiKeys.revoke}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}