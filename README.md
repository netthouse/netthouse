# Netthouse

**Payments infrastructure for AI agents.**
Double-entry ledger, x402 HTTP payments, and automatic clearing — so agents can pay, receive, and net out without you wiring a single cent.

🌐 **Live:** [netthouse.com](https://netthouse.com) · [Dashboard](https://app.netthouse.com) · [Docs](https://netthouse.com/docs)

## Features

- 📒 **Double-entry ledger** — every transaction balances; money is never created or destroyed
- ⚡ **x402 protocol** — agents pay for HTTP requests in a single round-trip
- ⚖️ **Automatic clearing** — opposing flows are netted; save 30–70% on gross transfers
- 🔑 **Scoped API keys** — admin / write / read / transact permissions, revocable anytime
- 💱 **Multi-currency accounts** — USD, EUR, tokens; crisp balances per account
- 🌍 **EN/RU dashboard** — protected by Clerk auth, live data, clearing analytics

## Quickstart

```bash
# Create an organization
curl -X POST https://netthouse-api.onrender.com/organizations -H "Content-Type: application/json" -d '{"name":"Acme","slug":"acme"}'

# Post a balanced transaction
curl -X POST https://netthouse-api.onrender.com/transactions -H "Content-Type: application/json" -d '{"orgId":"ORG_ID","description":"API usage","entries":[{"accountId":"ACC_1","direction":"debit","amount":"25.00"},{"accountId":"ACC_2","direction":"credit","amount":"25.00"}]}'

# See the clearing proposal
curl "https://netthouse-api.onrender.com/clearing?orgId=ORG_ID"
```

Full guide: [netthouse.com/docs](https://netthouse.com/docs)

## Stack

TypeScript monorepo (pnpm + Turborepo):
- **API** — Fastify 5, Drizzle ORM, Postgres (Neon)
- **Dashboard** — Next.js 16, Clerk auth, i18n EN/RU
- **Site & docs** — Next.js 16, Tailwind 4
- **Deploy** — Render (API, web, site), Neon (DB), Cloudflare (DNS + Email Routing)

## Local development

```bash
pnpm install
docker compose up -d
pnpm --filter @netthouse/api dev
pnpm --filter @netthouse/web dev
pnpm --filter @netthouse/site dev
```

## License

MIT