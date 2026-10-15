"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

type Organization = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export default function OrganizationsPage() {
  const { userId } = useAuth();
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await apiFetch<{ organizations: Organization[] }>(
        userId,
        "/organizations"
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
      await apiFetch(userId, "/organizations", {
        method: "POST",
        body: JSON.stringify({ name: newName, slug: newSlug }),
      });
      setNewName("");
      setNewSlug("");
      setShowCreate(false);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!userId) return <div className="p-8">Signing in...</div>;
  if (loading) return <div className="p-8">Loading organizations...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800"
        >
          + New organization
        </button>
      </div>

      {showCreate && (
        <div className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50">
          <h2 className="font-semibold mb-3">Create new organization</h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Name (e.g., Acme Corp)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Slug (e.g., acme-corp)"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {orgs.length === 0 ? (
        <div className="p-8 text-center text-slate-500 border border-dashed border-slate-300 rounded-lg">
          No organizations yet. Click "+ New organization" to create your first one.
        </div>
      ) : (
        <div className="space-y-3">
          {orgs.map((org) => (
            <div
              key={org.id}
              className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <div className="font-semibold">{org.name}</div>
              <div className="text-sm text-slate-500">/{org.slug}</div>
              <div className="text-xs text-slate-400 mt-1">
                Created {new Date(org.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}