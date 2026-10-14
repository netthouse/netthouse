export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">Netthouse</div>
          <nav className="flex gap-6 text-sm">
            <a href="#features" className="text-slate-600 hover:text-slate-900">Features</a>
            <a href="/docs" className="text-slate-600 hover:text-slate-900">Docs</a>
            <a href="https://app.netthouse.com" className="text-slate-600 hover:text-slate-900">Sign in</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <section className="py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Payments infrastructure<br />for AI agents
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            Ledger, x402 protocol, and automatic clearing — so your agents can pay,
            receive, and net out without you wiring a single cent.
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <a
              href="https://app.netthouse.com"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
            >
              Open dashboard
            </a>
            <a
              href="/docs"
              className="px-6 py-3 border border-slate-300 rounded-lg font-medium hover:bg-slate-50"
            >
              Read docs
            </a>
          </div>
        </section>

        <section id="features" className="py-20 border-t border-slate-200">
          <h2 className="text-3xl font-bold text-center mb-12">What you get</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature
              title="Double-entry ledger"
              description="Every transaction balances. Money is never created or destroyed — only moved between accounts."
            />
            <Feature
              title="x402 HTTP payments"
              description="AI agents pay for HTTP requests in a single round-trip. No sessions, no tokens, no invoices."
            />
            <Feature
              title="Automatic clearing"
              description="Opposing flows between accounts are netted out. Save 30–70% on gross transfers."
            />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        © 2026 Netthouse
      </footer>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 border border-slate-200 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}