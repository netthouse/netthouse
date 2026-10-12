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

async function getClearing(): Promise<ClearingData | null> {
  const orgsRes = await fetch(`${API_URL}/organizations`, { cache: "no-store" });
  if (!orgsRes.ok) return null;
  const orgs = await orgsRes.json();
  const orgId: string | undefined = orgs.organizations[0]?.id;
  if (!orgId) return null;

  const res = await fetch(`${API_URL}/clearing?orgId=${orgId}`, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

export default async function ClearingPage() {
  const data = await getClearing();

  if (!data) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Clearing</h1>
        <p className="text-slate-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Clearing Engine</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-xs font-medium text-slate-500 uppercase">Gross flow</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{Number(data.grossFlow).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-xs font-medium text-slate-500 uppercase">Net flow</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{Number(data.netFlow).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-xs font-medium text-slate-500 uppercase">Total saved</p>
          <p className="mt-1 text-3xl font-bold text-green-600">{Number(data.totalSaved).toFixed(2)}</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Netting proposals</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Net amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.proposals.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  No netting needed
                </td>
              </tr>
            ) : (
              data.proposals.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{p.fromAccountId.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-600">{p.toAccountId.slice(0, 8)}...</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{Number(p.netAmount).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}