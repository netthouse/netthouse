"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { getDictionary, type Locale } from "../i18n/dictionaries";

type Organization = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export default function OrganizationsClient({ locale }: { locale: Locale }) {
  const { userId, getToken } = useAuth();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const t = getDictionary(locale);

  const load = async () => {
  if (!userId) return;
  setLoading(true);
  try {
    const token = await getToken();
    const data = await apiFetch<{ organizations: Organization[] }>(
      userId,
      "/organizations",
      {},
      token
    );

      setOrgs(data.organizations);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) load();
  }, [userId]);

    const handleCreate = async () => {
    if (!userId || !newName || !newSlug) return;
    try {
      const token = await getToken();
      await apiFetch(userId, "/organizations", {
        method: "POST",
        body: JSON.stringify({ name: newName, slug: newSlug }),
      }, token);

      setNewName("");
      setNewSlug("");
      setShowCreate(false);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!userId) return <div className="p-4 sm:p-8">{t.common.signingIn}</div>;
  if (loading) return <div className="p-4 sm:p-8">{t.common.loading}</div>;
  if (error) return <div className="break-words p-4 text-red-600 sm:p-8">Error: {error}</div>;

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t.pages.organizations.title}</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 sm:w-auto"
        >
          {t.pages.organizations.newOrg}
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50">
          <h2 className="font-semibold mb-3">{t.pages.organizations.createTitle}</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder={t.pages.organizations.namePlaceholder}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="min-h-11 w-full rounded-md border border-slate-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder={t.pages.organizations.slugPlaceholder}
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="min-h-11 w-full rounded-md border border-slate-300 px-3 py-2"
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleCreate}
                className="min-h-11 w-full rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 sm:w-auto"
              >
                {t.common.create}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="min-h-11 w-full rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-100 sm:w-auto"
              >
                {t.common.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {orgs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 sm:p-8">
          {t.pages.organizations.empty}
        </div>
      ) : (
        <div className="space-y-3">
          {orgs.map((org) => (
            <div
              key={org.id}
              className="min-w-0 rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
            >
              <div className="font-semibold">{org.name}</div>
              <div className="text-sm text-slate-500">/{org.slug}</div>
              <div className="text-xs text-slate-400 mt-1">
                {t.pages.organizations.created} {new Date(org.createdAt).toLocaleDateString(locale)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}