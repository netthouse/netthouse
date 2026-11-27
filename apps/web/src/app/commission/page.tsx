import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import PayCommissionButton from "@/components/PayCommissionButton";
import CopyButton from "@/components/CopyButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const NETTHOUSE_FEE_ADDRESS =
  process.env.NEXT_PUBLIC_FEE_ADDRESS ?? "0x695B93A45e996A6bc8fee792503ee49c9a89B23d";

type CommissionTx = {
  tx_hash: string;
  from_address: string;
  amount: string;
  fee_amount: string;
  resource: string;
  created_at: string;
};

type CommissionData = {
  sellerAddress: string;
  totalUnpaid: string;
  count: number;
  transactions: CommissionTx[];
};

export default async function CommissionPage() {
  const { userId, getToken } = await auth();
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const t = getDictionary(locale);
  const tc = t.pages.commission;

  if (!userId) {
    return <div className="p-4 text-slate-500 sm:p-8">{t.common.notSignedIn}</div>;
  }

  // TODO: load sellerAddress from the selected organization profile.
  const sellerAddress = "0x9CeceD626E30b60AaFDe7DFa65b6B4BD4c674a64";
  const token = await getToken();
  const res = await fetch(`${API_URL}/commission/${sellerAddress}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });

  let data: CommissionData | null = null;
  if (res.ok) data = await res.json();

  const formatUsdc = (amount: string) => (Number(amount) / 1_000_000).toFixed(6);
  const basescanUrl = (tx: string) => `https://basescan.org/tx/${tx}`;

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-5 text-2xl font-bold sm:mb-6">{tc.title}</h1>

      {data ? (
        <>
          <section className="mb-5 rounded-lg bg-white p-4 shadow sm:mb-6 sm:p-6">
            <div className="mb-5">
              <p className="mb-2 text-sm text-slate-500">{tc.sellerAddress}</p>
              <div className="flex min-w-0 items-center gap-2">
                <p className="min-w-0 flex-1 break-all font-mono text-xs text-slate-800 sm:text-sm">{data.sellerAddress}</p>
                <CopyButton value={data.sellerAddress} locale={locale} />
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-1 text-sm text-slate-500">{tc.totalUnpaid}</p>
              <p className="break-words text-2xl font-bold text-red-600 sm:text-3xl">{formatUsdc(data.totalUnpaid)} USDC</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-slate-500">{tc.payTo}</p>
              <div className="flex min-w-0 items-center gap-2 rounded-lg bg-slate-50 p-2">
                <p className="min-w-0 flex-1 break-all font-mono text-xs text-slate-800 sm:text-sm">{NETTHOUSE_FEE_ADDRESS}</p>
                <CopyButton value={NETTHOUSE_FEE_ADDRESS} locale={locale} />
              </div>
            </div>

            <PayCommissionButton
              feeAddress={NETTHOUSE_FEE_ADDRESS}
              amountUsdc={formatUsdc(data.totalUnpaid)}
              sellerAddress={data.sellerAddress}
              label={`${tc.payButton} (${formatUsdc(data.totalUnpaid)} USDC)`}
              locale={locale}
            />
          </section>

          <div className="space-y-3 md:hidden">
            {data.transactions.length === 0 ? (
              <div className="rounded-lg bg-white p-6 text-center text-sm text-slate-500 shadow">{tc.empty}</div>
            ) : data.transactions.map((tx) => (
              <article key={tx.tx_hash} className="min-w-0 rounded-lg bg-white p-4 shadow">
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-1">
                    <a href={basescanUrl(tx.tx_hash)} target="_blank" rel="noopener noreferrer" title={tx.tx_hash} className="min-w-0 truncate font-mono text-sm text-blue-600 hover:underline">
                      {tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-8)}
                    </a>
                    <CopyButton value={tx.tx_hash} locale={locale} className="shrink-0" />
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-slate-900">{formatUsdc(tx.amount)} USDC</span>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-2"><span className="shrink-0 text-slate-500">{tc.from}</span><div className="flex min-w-0 items-center gap-1"><span className="truncate font-mono text-slate-700" title={tx.from_address}>{tx.from_address.slice(0, 8)}...{tx.from_address.slice(-6)}</span><CopyButton value={tx.from_address} locale={locale} /></div></div>
                  <div className="flex justify-between gap-3"><span className="text-slate-500">{tc.fee}</span><span className="font-medium text-red-600">{formatUsdc(tx.fee_amount)} USDC</span></div>
                  <div className="flex justify-between gap-3"><span className="text-slate-500">{tc.resource}</span><span className="max-w-[65%] truncate font-mono text-slate-700" title={tx.resource}>{tx.resource}</span></div>
                  <p className="text-xs text-slate-500">{new Date(tx.created_at).toLocaleString(locale)}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-lg bg-white shadow md:block">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">{tc.txHash}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">{tc.from}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">{tc.amount}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">{tc.fee}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">{tc.resource}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">{tc.date}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {data.transactions.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">{tc.empty}</td></tr>
                ) : data.transactions.map((tx) => (
                  <tr key={tx.tx_hash} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm"><a href={basescanUrl(tx.tx_hash)} target="_blank" rel="noopener noreferrer" className="font-mono text-blue-600 hover:underline" title={tx.tx_hash}>{tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-8)}</a></td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-700" title={tx.from_address}>{tx.from_address.slice(0, 8)}...{tx.from_address.slice(-6)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatUsdc(tx.amount)} USDC</td>
                    <td className="px-6 py-4 text-sm font-medium text-red-600">{formatUsdc(tx.fee_amount)} USDC</td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-600">{tx.resource}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(tx.created_at).toLocaleString(locale)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="rounded-lg bg-white p-5 text-sm text-slate-500 shadow sm:p-8">{tc.loadError}</div>
      )}
    </div>
  );
}
