\## Text



Show HN: We built open-source payment infrastructure for AI agents using Coinbase's x402 protocol.



\*\*What it does:\*\*



\- HTTP resources with pay-per-request pricing (USDC on Base mainnet)

\- No accounts, no API keys, no invoices — just a wallet and a fetch

\- Gasless for sellers (our facilitator pays gas)

\- Subscription tiers (Free $0, Pro $29/mo, Enterprise $299/mo) with dynamic commission (10% / 5% / 2%)

\- Automatic suspension lever for bad sellers

\- Two public SDKs: TypeScript (npm) and Python (PyPI)



\*\*Live demo:\*\*



\- Production API with 4 paid resources: https://api.netthouse.com/discover

\- Dashboard with billing: https://app.netthouse.com

\- First on-chain payment via Python SDK: https://sepolia.basescan.org/tx/0xf9f7589adeb5e10019cd95b871cb74b3b3e3b54b5940964bae2794ce912eb0e8

\- First mainnet payment (commission 5% for Pro tier): https://basescan.org/tx/0xc177acae1afc9e6eee5bc1ab92c55d65e33b3b631ad8d83b03dfe3c5ddd659a1



\*\*How it works:\*\*



1\. Agent GETs a paid resource

2\. Server responds 402 with payment requirements

3\. SDK signs EIP-3009 TransferWithAuthorization off-chain

4\. SDK retries with X-PAYMENT header

5\. Facilitator verifies + settles on-chain (USDC transfer, seller receives gasless)



\*\*Stack:\*\*



\- Fastify (Node.js API)

\- viem + eth-account (EIP-712 signing)

\- PostgreSQL (Neon) — double-entry ledger

\- Stripe (subscriptions)

\- Clerk (auth)

\- Base mainnet (production), Base Sepolia (testnet)

\- Render (hosting, custom domain)



\*\*Why x402:\*\*



AI agents need to pay for data/APIs without human intervention. x402 turns HTTP 402 into a payment rail. Agents can autonomously buy data, compute, or services — one line of code.



\*\*Repos:\*\*



\- TypeScript SDK: https://github.com/Zhasulan391/sdk-typescript (npm: @netthouse/sdk)

\- Python SDK: https://github.com/Zhasulan391/sdk-python (PyPI: netthouse)

\- Main repo: https://github.com/netthouse/netthouse



Happy to answer questions!



\## URL



https://api.netthouse.com/discover

