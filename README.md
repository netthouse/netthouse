\# Netthouse



Clearing and cost-attribution layer for AI agents.



\## Requirements



\- Node.js 20+

\- pnpm 12+

\- Docker Desktop



\## Quick Start



```bash

\# 1. Install dependencies

pnpm install



\# 2. Start PostgreSQL + Redis

docker compose up -d



\# 3. Run database migrations

cd packages/db

pnpm migrate



\# 4. Start API (port 3001)

cd apps/api

pnpm dev



\# 5. In another terminal, start Web (port 3000)

cd apps/web

pnpm dev

