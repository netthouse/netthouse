const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Organization = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

async function getOrganizations(): Promise<Organization[]> {
  const res = await fetch(`${API_URL}/organizations`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch organizations");
  }
  const data = await res.json();
  return data.organizations;
}

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Organizations</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {organizations.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  No organizations yet
                </td>
              </tr>
            ) : (
              organizations.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{org.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{org.slug}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(org.createdAt).toLocaleDateString()}
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