import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentOrg } from "@/lib/org";

const ADMIN_KEY = process.env.API_ADMIN_KEY ?? "";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type PaymentRow = {
  tx_hash: string;
  from_address: string;
  amount: string;
  resource: string;
  created_at: string;
};

export default async function PaymentsPage() {
  const { userId } = await auth();
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const t = getDictionary(locale);

  if (!userId) {
    return <div className="p-8 text-slate-500">Not signed in</div>;
  }

  const currentOrg = await getCurrentOrg();
  const orgId = currentOrg?.id;
  let payments: PaymentRow[] = [];

  if (orgId) {
    const res = await fetch(`${API_URL}/payments?orgId=${orgId}`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${ADMIN_KEY}`,
        "X-User-Id": userId,
      },
    });
    if (res.ok) {
      const data = await res.json();
      payments = data.payments;
    }
  }

  const formatUsdc = (amount: string) => (Number(amount) / 1_000_000).toFixed(2);
  const basescanUrl = (tx: string) => `https://sepolia.basescan.org/tx/${tx}`;
  const tp = t.pages.payments;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">{tp.title}</h1>
      {orgId ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{tp.txHash}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{tp.from}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{tp.amount}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{tp.resource}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{tp.date}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    {tp.empty}
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.tx_hash} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={basescanUrl(p.tx_hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-blue-600 hover:underline"
                        title={p.tx_hash}
                      >
                        {p.tx_hash.slice(0, 10)}...{p.tx_hash.slice(-8)}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-slate-700" title={p.from_address}>
                      {p.from_address.slice(0, 8)}...{p.from_address.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-green-700">
                      {formatUsdc(p.amount)} USDC
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{p.resource}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-slate-500">{tp.noOrg}</div>
      )}
    </div>
  );
}