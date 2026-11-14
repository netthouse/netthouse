import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import PayCommissionButton from "@/components/PayCommissionButton";

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
    return <div className="p-8 text-slate-500">{t.common.notSignedIn}</div>;
  }

  // TODO: брать sellerAddress из профиля org
  const sellerAddress = "0x9CeceD626E30b60AaFDe7DFa65b6B4BD4c674a64";
  const token = await getToken();
  const res = await fetch(`${API_URL}/commission/${sellerAddress}`, {
  cache: "no-store",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


  let data: CommissionData | null = null;
  if (res.ok) {
    data = await res.json();
  }

  const formatUsdc = (amount: string) => (Number(amount) / 1_000_000).toFixed(6);
  const basescanUrl = (tx: string) => `https://basescan.org/tx/${tx}`;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{tc.title}</h1>

      {data ? (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="text-sm text-slate-500 mb-2">{tc.sellerAddress}</div>
            <div className="font-mono text-sm mb-4">{data.sellerAddress}</div>

            <div className="text-sm text-slate-500 mb-2">{tc.totalUnpaid}</div>
            <div className="text-3xl font-bold text-red-600 mb-4">
              {formatUsdc(data.totalUnpaid)} USDC
            </div>

            <div className="text-sm text-slate-500 mb-2">{tc.payTo}</div>
            <div className="font-mono text-sm bg-slate-50 p-3 rounded break-all">
              {NETTHOUSE_FEE_ADDRESS}
            </div>

           <PayCommissionButton
              feeAddress={NETTHOUSE_FEE_ADDRESS}
              amountUsdc={formatUsdc(data.totalUnpaid)}
              sellerAddress={data.sellerAddress}
              label={`${tc.payButton} (${formatUsdc(data.totalUnpaid)} USDC)`}
              locale={locale}
            />
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{tc.txHash}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{tc.from}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{tc.amount}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{tc.fee}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{tc.resource}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{tc.date}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {data.transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      {tc.empty}
                    </td>
                  </tr>
                ) : (
                  data.transactions.map((tx) => (
                    <tr key={tx.tx_hash} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm">
                        <a
                          href={basescanUrl(tx.tx_hash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-blue-600 hover:underline"
                          title={tx.tx_hash}
                        >
                          {tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-8)}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-700" title={tx.from_address}>
                        {tx.from_address.slice(0, 8)}...{tx.from_address.slice(-6)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatUsdc(tx.amount)} USDC
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-red-600">
                        {formatUsdc(tx.fee_amount)} USDC
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">{tx.resource}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(tx.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-slate-500">{tc.loadError}</div>
      )}
    </div>
  );
}