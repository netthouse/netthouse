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
        <div className="bg-green-50 border border-green-300 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🔑</div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 mb-2">
                {t.pages.apiKeys.createSuccess}
              </h3>
              <p className="text-sm text-green-800 mb-3">
                <strong>{t.pages.apiKeys.saveNow}</strong>
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={newKey}
                  className="flex-1 px-3 py-2 border border-green-400 rounded-md bg-white font-mono text-sm"
                />
                <button
                  onClick={copyKey}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                >
                  {copied ? t.common.copied : t.common.copy}
                </button>
                <button
                  onClick={() => setNewKey(null)}
                  className="px-4 py-2 border border-green-400 text-green-800 rounded-md text-sm hover:bg-green-100"
                >
                  {t.common.dismiss}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmRevoke && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-2">{t.pages.apiKeys.revokeTitle}</h3>
            <p className="text-sm text-slate-600 mb-4">
              {t.pages.apiKeys.revokeConfirm}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmRevoke(null)}
                className="px-4 py-2 border border-slate-300 rounded-md text-sm hover:bg-slate-100"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={confirmRevokeAction}
                disabled={isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
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
            className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-sm"
          >
            {t.pages.apiKeys.createKey}
          </button>
        )}

        {showForm && (
          <div className="p-4 border border-slate-200 rounded-lg bg-white space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                {t.pages.apiKeys.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                placeholder={t.pages.apiKeys.namePlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">
                {t.pages.apiKeys.scopes}
              </label>
              <div className="flex flex-wrap gap-3">
                {AVAILABLE_SCOPES.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-sm">
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
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={isPending}
                className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 text-sm disabled:opacity-50"
              >
                {isPending ? t.common.creating : t.common.create}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
                className="px-4 py-2 border border-slate-300 rounded-md text-sm hover:bg-slate-100"
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
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