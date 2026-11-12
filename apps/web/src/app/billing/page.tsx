import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { getDictionary } from "@/i18n/dictionaries";
import { getCurrentOrg } from "@/lib/org";


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type BillingData = {
  tier: string;
  commissionPercent: number;
  status: string;
  currentPeriodEnd?: string;
};

export default async function BillingPage() {
  const { userId, getToken } = await auth();
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const t = getDictionary(locale);

  if (!userId) {
    return <div className="p-8 text-slate-500">{t.common.notSignedIn}</div>;
  }

    const currentOrg = await getCurrentOrg();

  if (!currentOrg) {
    return <div className="p-8 text-slate-500">No organization selected</div>;
  }

  const orgId = currentOrg.id;
  const token = await getToken();

  const res = await fetch(`${API_URL}/billing/${orgId}`, {
    cache: "no-store",
   headers: {
  "X-User-Id": userId,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
},

  });

  const billing: BillingData = res.ok
    ? await res.json()
    : { tier: "free", commissionPercent: 10, status: "active" };

  const L = locale === "ru"
    ? {
        title: "Тарифы и биллинг",
        currentPlan: "Текущий план",
        free: "Free",
        pro: "Pro",
        enterprise: "Enterprise",
        freeDesc: "Для старта",
        proDesc: "Для растущих проектов",
        enterpriseDesc: "Для крупного бизнеса",
        month: "/мес",
        commission: "Комиссия",
        upgrade: "Оформить",
        active: "Активен",
      }
    : {
        title: "Billing & Plans",
        currentPlan: "Current plan",
        free: "Free",
        pro: "Pro",
        enterprise: "Enterprise",
        freeDesc: "For starters",
        proDesc: "For growing projects",
        enterpriseDesc: "For enterprise",
        month: "/mo",
        commission: "Commission",
        upgrade: "Subscribe",
        active: "Active",
      };

  const plans = [
    { id: "free", name: L.free, price: 0, commission: 10, desc: L.freeDesc },
    { id: "pro", name: L.pro, price: 29, commission: 5, desc: L.proDesc },
    { id: "enterprise", name: L.enterprise, price: 299, commission: 2, desc: L.enterpriseDesc },
  ];

  const planNames: Record<string, string> = { free: L.free, pro: L.pro, enterprise: L.enterprise };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{L.title}</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm">
          {L.currentPlan}: <strong>{planNames[billing.tier] ?? billing.tier}</strong> ({L.commission}: {billing.commissionPercent}%)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow p-6 border-2 ${
              billing.tier === plan.id ? "border-blue-500" : "border-slate-200"
            }`}
          >
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{plan.desc}</p>
            <div className="text-3xl font-bold mb-4">
              ${plan.price}<span className="text-lg text-slate-500">{L.month}</span>
            </div>
            <div className="text-sm text-slate-600 mb-4">
              {L.commission}: <strong>{plan.commission}%</strong>
            </div>
            {billing.tier === plan.id ? (
              <button
                disabled
                className="w-full bg-slate-100 text-slate-500 px-4 py-2 rounded cursor-not-allowed"
              >
                ✓ {L.currentPlan}
              </button>
            ) : plan.id === "free" ? (
              <button
                disabled
                className="w-full bg-slate-100 text-slate-500 px-4 py-2 rounded cursor-not-allowed"
              >
                —
              </button>
            ) : (
              <form action={`/api/billing/checkout`} method="POST">
                <input type="hidden" name="orgId" value={orgId} />
                <input type="hidden" name="tier" value={plan.id} />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {L.upgrade}
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}