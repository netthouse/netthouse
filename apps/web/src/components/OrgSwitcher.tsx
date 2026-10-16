"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setCurrentOrg } from "@/app/actions";
import { getDictionary } from "@/i18n/dictionaries";

type Org = { id: string; name: string; slug: string };

export default function OrgSwitcher({
  orgs,
  currentOrgId,
  locale,
}: {
  orgs: Org[];
  currentOrgId: string | null;
  locale: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const t = getDictionary(locale);

  const handleChange = (orgId: string) => {
    startTransition(() => {
      setCurrentOrg(orgId).then(() => router.refresh());
    });
  };

  if (orgs.length === 0) return null;

  return (
    <div className="mb-6">
      <label className="block text-xs text-slate-400 mb-1">
        {t.nav.organizations}
      </label>
      <select
        value={currentOrgId ?? ""}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md bg-slate-800 text-white text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50"
      >
        {orgs.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </div>
  );
}