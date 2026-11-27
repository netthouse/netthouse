import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentOrg } from "@/lib/org";
import ClearingApplyButton from "@/components/ClearingApplyButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Proposal = {
  fromAccountId: string;
  toAccountId: string;
  netAmount: string;
};

type ClearingData = {
  proposals: Proposal[];
  grossFlow: string;
  netFlow: string;
  totalSaved: string;
};

export default async function ClearingPage() {
  const { userId, getToken } = await auth();
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const t = getDictionary(locale);

  if (!userId) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-bold">{t.pages.clearing.title}</h1>
        <p className="text-slate-500">Not signed in</p>
      </div>
    );
  }

  const currentOrg = await getCurrentOrg();
  const orgId = currentOrg?.id;
  let data: ClearingData | null = null;

  if (orgId) {
    const token = await getToken();
    const res = await fetch(`${API_URL}/clearing?orgId=${orgId}`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) data = await res.json();
  }

  if (!data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-bold">{t.pages.clearing.title}</h1>
        <p className="text-slate-500">{t.pages.clearing.noData}</p>
      </div>
    );
  }

  const metrics = [
    { label: t.pages.clearing.gross, value: data.grossFlow, tone: "text-slate-900" },
    { label: t.pages.clearing.net, value: data.netFlow, tone: "text-slate-900" },
    { label: t.pages.clearing.saved, value: data.totalSaved, tone: "text-green-600" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{t.pages.clearing.title}</h1>
        <ClearingApplyButton
          userId={userId}
          orgId={orgId!}
          hasProposals={data.proposals.length > 0}
          locale={locale as "en" | "ru"}
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={`rounded-lg bg-white p-4 shadow sm:p-6 ${index === 2 ? "border-l-4 border-green-500" : ""}`}
          >
            <p className="text-xs font-medium uppercase text-slate-500">{metric.label}</p>
            <p className={`mt-1 break-words text-2xl font-bold sm:text-3xl ${metric.tone}`}>
              {Number(metric.value).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold">{t.pages.clearing.proposals}</h2>
      <div className="space-y-3 md:hidden">
        {data.proposals.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center text-sm text-slate-500 shadow">
            {t.pages.clearing.noNetting}
          </div>
        ) : (
          data.proposals.map((proposal, index) => (
            <article key={`${proposal.fromAccountId}-${proposal.toAccountId}-${index}`} className="rounded-lg bg-white p-4 shadow">
              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-medium uppercase text-slate-500">{t.pages.clearing.from}</p>
                  <p className="truncate font-mono text-sm text-slate-700" title={proposal.fromAccountId}>
                    {proposal.fromAccountId.slice(0, 8)}...
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-medium uppercase text-slate-500">{t.pages.clearing.to}</p>
                  <p className="truncate font-mono text-sm text-slate-700" title={proposal.toAccountId}>
                    {proposal.toAccountId.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <p className="mt-3 text-lg font-bold text-slate-900">
                {t.pages.clearing.netAmount}: {Number(proposal.netAmount).toFixed(2)}
              </p>
            </article>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto rounded-lg bg-white shadow md:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">{t.pages.clearing.from}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">{t.pages.clearing.to}</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">{t.pages.clearing.netAmount}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {data.proposals.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">{t.pages.clearing.noNetting}</td>
              </tr>
            ) : (
              data.proposals.map((proposal, index) => (
                <tr key={`${proposal.fromAccountId}-${proposal.toAccountId}-${index}`} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{proposal.fromAccountId.slice(0, 8)}...</td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{proposal.toAccountId.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{Number(proposal.netAmount).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
