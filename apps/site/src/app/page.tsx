export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div className="text-xl font-bold">Netthouse</div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#how" className="text-slate-600 hover:text-slate-900">How it works</a>
            <a href="#features" className="text-slate-600 hover:text-slate-900">Features</a>
            <a href="#use-cases" className="text-slate-600 hover:text-slate-900">Use cases</a>
            <a href="/docs" className="text-slate-600 hover:text-slate-900">Docs</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900">Pricing</a>
          </nav>
          <a
            href="https://app.netthouse.com"
            className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800"
          >
            Sign in
          </a>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Live on netthouse.com
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            Payments infrastructure
            <br />
            <span className="text-slate-400">for AI agents</span>
          </h1>
          <p className="mt-8 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Double-entry ledger, HTTP-native payments (x402), and automatic
            clearing. Your agents pay, receive, and net out — you never wire
            a cent.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <a
              href="https://app.netthouse.com"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 shadow-sm"
            >
              Open dashboard →
            </a>
            <a
              href="/docs"
              className="px-6 py-3 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50"
            >
              Read the docs
            </a>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-slate-200 py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
            <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16">
              Four steps from sign-up to cleared payments. No SDKs, no integrations — just HTTP.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Step num="1" title="Create an org" text="One workspace per team. Isolated data, scoped keys." />
              <Step num="2" title="Issue API keys" text="Admin, write, read, transact — granular permissions out of the box." />
              <Step num="3" title="Agents transact" text="Balanced ledger entries via REST or x402 headers on any HTTP call." />
              <Step num="4" title="Net out" text="Opposing flows auto-clear. Pay only the difference." />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Built for the agent economy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Feature
                emoji="📒"
                title="Double-entry ledger"
                description="Every transaction balances. Money is never created or destroyed — only moved between accounts. Audit-ready from day one."
              />
              <Feature
                emoji="⚡"
                title="x402 HTTP payments"
                description="Agents pay for HTTP requests in a single round-trip. No sessions, no tokens, no invoices. Just a 402 and an X-PAYMENT header."
              />
              <Feature
                emoji="⚖️"
                title="Automatic clearing"
                description="Opposing flows between accounts are netted out. Save 30–70% on gross transfers without touching a spreadsheet."
              />
              <Feature
                emoji="🔑"
                title="Scoped API keys"
                description="Issue keys with fine-grained permissions: admin, write, read, transact. Revoke anytime. No shared secrets."
              />
              <Feature
                emoji="💱"
                title="Multi-currency"
                description="USD, EUR, tokens — each account has its own currency. Balances stay crisp, no cross-rate confusion."
              />
              <Feature
                emoji="🛡️"
                title="Auth & audit"
                description="Every mutation is tied to a Clerk user. Full history of who did what, when, and why."
              />
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section id="use-cases" className="py-24 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Use cases</h2>
            <p className="text-center text-slate-400 max-w-2xl mx-auto mb-16">
              Where Netthouse pays for itself in the first week.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UseCase
                title="AI agent gateways"
                text="Charge LLM providers, tool APIs, and data feeds per call. Agents settle in real time — no pre-funding, no reconciliation."
              />
              <UseCase
                title="MCP servers"
                text="Monetize your Model Context Protocol server. Clients pay with x402, you keep a clean ledger, and net out at month end."
              />
              <UseCase
                title="Agent-to-agent marketplaces"
                text="Let agents buy services from each other. Netthouse clears the bidirectional flows so only the net amount moves."
              />
              <UseCase
                title="Cost attribution"
                text="See exactly how much each agent, task, or project spent. Roll up by org, agent, or account — ready for the finance team."
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Simple pricing</h2>
            <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16">
              Free while you build. Pay when you scale.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Price
                name="Hobby"
                price="Free"
                desc="For experiments and side projects"
                features={["1 organization", "10k transactions/month", "Community support"]}
                highlight={false}
              />
              <Price
                name="Pro"
                price="$29"
                desc="Per month, per organization"
                features={["Unlimited orgs", "1M transactions/month", "Priority support", "Custom domains"]}
                highlight={true}
              />
              <Price
                name="Enterprise"
                price="Custom"
                desc="For regulated workloads"
                features={["SLA", "On-prem option", "SSO / SAML", "Dedicated CSM"]}
                highlight={false}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Start building in 5 minutes</h2>
            <p className="text-slate-600 mb-8">
              No credit card. No sales call. Sign up, create an org, and post your first transaction.
            </p>
            <a
              href="https://app.netthouse.com"
              className="inline-block px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
            >
              Create your organization →
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="font-bold">Netthouse</span>
              </div>
              <p className="text-sm text-slate-500">
                Payments infrastructure for AI agents.
              </p>
            </div>
            <FooterCol title="Product" links={["Features", "Pricing", "Docs", "Changelog"]} />
            <FooterCol title="Company" links={["About", "Blog", "Contact"]} />
            <FooterCol title="Legal" links={["Privacy", "Terms", "Security"]} />
          </div>
          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            © 2026 Netthouse. Built with ❤️ for the agent economy.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Step({ num, title, text }: { num: string; title: string; text: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
        {num}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}

function Feature({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function UseCase({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function Price({
  name,
  price,
  desc,
  features,
  highlight,
}: {
  name: string;
  price: string;
  desc: string;
  features: string[];
  highlight: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-lg border ${
        highlight
          ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-105"
          : "bg-white border-slate-200"
      }`}
    >
      <h3 className={`text-lg font-semibold ${highlight ? "text-white" : "text-slate-900"}`}>{name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={`text-4xl font-bold ${highlight ? "text-white" : "text-slate-900"}`}>{price}</span>
        {price !== "Free" && price !== "Custom" && (
          <span className={`text-sm ${highlight ? "text-slate-400" : "text-slate-500"}`}>/mo</span>
        )}
      </div>
      <p className={`mt-2 text-sm ${highlight ? "text-slate-400" : "text-slate-600"}`}>{desc}</p>
      <ul className={`mt-6 space-y-2 text-sm ${highlight ? "text-slate-300" : "text-slate-600"}`}>
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className={highlight ? "text-green-400" : "text-green-600"}>✓</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}