# Netthouse

**Payments infrastructure for AI agents.**
Double-entry ledger, x402 HTTP payments, and automatic clearing — so agents can pay, receive, and net out without you wiring a single cent.

**Live:** [netthouse.com](https://netthouse.com) · [Dashboard](https://app.netthouse.com) · [Docs](https://netthouse.com/docs)

## Features

- **Double-entry ledger** — every transaction balances; money is never created or destroyed
- **x402 protocol** — agents pay for HTTP requests in a single round-trip
- **Automatic clearing** — opposing flows are netted; save 30–70% on gross transfers
- **Scoped API keys** — admin / write / read / transact permissions, revocable anytime
- **Multi-currency accounts** — USD, EUR, tokens; crisp balances per account
- **EN/RU dashboard** — protected by Clerk auth, live data, clearing analytics

## Quickstart

### Discover paid API resources

```bash
curl https://api.netthouse.com/discover
```

### Call a paid resource

Paid resources use the x402 protocol and require a USDC payment on Base. Use the official TypeScript SDK to handle the `402 Payment Required` response and retry with the signed `X-PAYMENT` header:

```bash
npm install @netthouse/sdk
```

```ts
import { createX402Client } from "@netthouse/sdk";

const client = createX402Client({
  privateKey: process.env.BUYER_PRIVATE_KEY as `0x${string}`,
});

const result = await client.fetch(
  "https://api.netthouse.com/market-data"
);

console.log(await result.response.json());
```

Available paid resources currently cost 0.05–0.25 USDC per request.

### Dashboard API

Organization, account, transaction, clearing, payment and API-key management routes are protected by Clerk JWT authentication. They are not public endpoints and must not be called without:

```http
Authorization: Bearer <CLERK_SESSION_JWT>
```

API keys for external integrations are issued from the Netthouse dashboard. Dashboard users sign in through Clerk at [app.netthouse.com](https://app.netthouse.com).

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
