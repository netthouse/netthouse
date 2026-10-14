import Link from "next/link";

const API = "https://netthouse-api.onrender.com";

function Code({ children }: { children: string }) {
  return (
    <pre className="mt-4 p-4 bg-slate-900 text-slate-100 rounded-lg text-xs overflow-x-auto">
      <code>{children}</code>
    </pre>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
           <Link href="/">
            <img src="/netthouse-horizontal-color.svg" alt="Netthouse" className="h-8 w-auto" />
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/#features" className="text-slate-600 hover:text-slate-900">
              Features
            </Link>
            <Link href="/docs" className="text-slate-900 font-medium">
              Docs
            </Link>
            <a
              href="https://app.netthouse.com"
              className="text-slate-600 hover:text-slate-900"
            >
              Sign in
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="hidden lg:block">
          <nav className="space-y-2 text-sm sticky top-24">
            <a href="#introduction" className="block text-slate-600 hover:text-slate-900">Introduction</a>
            <a href="#quickstart" className="block text-slate-600 hover:text-slate-900">Quickstart</a>
            <a href="#x402" className="block text-slate-600 hover:text-slate-900">x402 payments</a>
            <a href="#api" className="block text-slate-600 hover:text-slate-900">API reference</a>
          </nav>
        </aside>

        <main className="lg:col-span-3 space-y-14">
          <section id="introduction">
            <h1 className="text-3xl font-bold">Introduction</h1>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Netthouse is a clearing and cost-attribution layer for AI agents.
              It gives you a double-entry ledger, HTTP-native payments (x402),
              and automatic netting of opposing money flows — so agents can pay
              for resources without invoices, sessions, or manual wiring.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Core concepts: <b>Organization</b> (your workspace), <b>Agent</b> (an
              AI actor), <b>Account</b> (a balance in one currency), <b>Transaction</b>{" "}
              (a balanced set of ledger entries), <b>Clearing</b> (netting of opposing
              flows between two accounts).
            </p>
          </section>

          <section id="quickstart">
            <h2 className="text-2xl font-bold">Quickstart</h2>
            <p className="mt-4 text-slate-600">
              Everything below works against the live sandbox API. Four steps to
              your first cleared payment.
            </p>

            <h3 className="mt-6 text-lg font-semibold">1. Create an organization</h3>
            <Code>{`curl -X POST ${API}/organizations -H "Content-Type: application/json" -d '{"name":"Acme","slug":"acme"}'`}</Code>

            <h3 className="mt-6 text-lg font-semibold">2. Create an agent and two accounts</h3>
            <Code>{`curl -X POST ${API}/agents -H "Content-Type: application/json" -d '{"orgId":"ORG_ID","name":"My Agent"}'`}</Code>
            <Code>{`curl -X POST ${API}/accounts -H "Content-Type: application/json" -d '{"orgId":"ORG_ID","agentId":"AGENT_ID","currency":"USD"}'`}</Code>
            <Code>{`curl -X POST ${API}/accounts -H "Content-Type: application/json" -d '{"orgId":"ORG_ID","currency":"USD"}'`}</Code>

            <h3 className="mt-6 text-lg font-semibold">3. Post a balanced transaction</h3>
            <Code>{`curl -X POST ${API}/transactions -H "Content-Type: application/json" -d '{"orgId":"ORG_ID","description":"API usage","entries":[{"accountId":"ACC_1","direction":"debit","amount":"25.00"},{"accountId":"ACC_2","direction":"credit","amount":"25.00"}]}'`}</Code>

            <h3 className="mt-6 text-lg font-semibold">4. See the clearing proposal</h3>
            <Code>{`curl "${API}/clearing?orgId=ORG_ID"`}</Code>
            <p className="mt-4 text-slate-600">
              The response shows gross flow, net flow and how much you save by
              netting opposing transfers instead of executing them one by one.
            </p>
          </section>

          <section id="x402">
            <h2 className="text-2xl font-bold">x402 payments</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              x402 turns HTTP 402 «Payment Required» into a machine-readable payment
              protocol. Flow:
            </p>
            <ol className="mt-4 list-decimal list-inside space-y-2 text-slate-600">
              <li>Agent calls a paid resource.</li>
              <li>Server responds <b>402</b> with payment requirements (amount, currency, recipient).</li>
              <li>Agent retries with an <b>X-PAYMENT</b> header carrying the payment payload.</li>
              <li>Server verifies, settles on the ledger, and serves the resource.</li>
            </ol>
            <Code>{`curl https://your-paid-resource.example/data -H "X-PAYMENT: <payload>"`}</Code>
            <p className="mt-4 text-slate-600">
              Settlement is a single balanced ledger transaction — no external
              rails, no floats, no reconciliation at the end of the month.
            </p>
          </section>

          <section id="api">
            <h2 className="text-2xl font-bold">API reference</h2>
            <div className="mt-6 overflow-hidden border border-slate-200 rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Method</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Path</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <Row m="POST" p="/organizations" d="Create organization" />
                  <Row m="GET" p="/organizations" d="List organizations" />
                  <Row m="POST" p="/agents" d="Create agent" />
                  <Row m="POST" p="/accounts" d="Create account" />
                  <Row m="GET" p="/accounts?orgId=" d="List accounts" />
                  <Row m="GET" p="/accounts/:id/balance" d="Account balance" />
                  <Row m="POST" p="/transactions" d="Post balanced transaction" />
                  <Row m="GET" p="/transactions?orgId=" d="List transactions" />
                  <Row m="GET" p="/clearing?orgId=" d="Clearing proposal" />
                  <Row m="POST" p="/api-keys" d="Issue API key (admin)" />
                  <Row m="GET" p="/api-keys?orgId=" d="List API keys (admin)" />
                  <Row m="POST" p="/api-keys/:id/revoke" d="Revoke key (admin)" />
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Row({ m, p, d }: { m: string; p: string; d: string }) {
  return (
    <tr>
      <td className="px-4 py-2 font-mono text-xs font-semibold text-slate-900">{m}</td>
      <td className="px-4 py-2 font-mono text-xs text-slate-600">{p}</td>
      <td className="px-4 py-2 text-slate-600">{d}</td>
    </tr>
  );
}