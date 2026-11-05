\# Hacker News Show HN Post



\## Title

Show HN: x402 payments for AI agents – TypeScript + Python SDKs



\## URL

https://github.com/Zhasulan391/sdk-typescript



\## Text

We built an open-source payment infrastructure for AI agents using Coinbase's x402 protocol.



\*\*What it does:\*\*

\- HTTP resources with pay-per-request pricing (USDC on Base)

\- No accounts, no API keys, no invoices

\- Gasless for sellers (facilitator pays gas)

\- Two public SDKs: TypeScript (npm) and Python (PyPI)



\*\*Live demo:\*\*

\- API with 4 paid resources: https://netthouse-api.onrender.com/discover

\- First on-chain payment via Python SDK: https://sepolia.basescan.org/tx/0xf9f7589adeb5e10019cd95b871cb74b3b3e3b54b5940964bae2794ce912eb0e8



\*\*How it works:\*\*

1\. Agent GETs a paid resource

2\. Server responds 402 with payment requirements

3\. SDK signs EIP-3009 TransferWithAuthorization off-chain

4\. SDK retries with X-PAYMENT header

5\. Facilitator verifies + settles on-chain (USDC transfer)



\*\*Stack:\*\*

\- Fastify (Node.js API)

\- viem + eth-account (EIP-712 signing)

\- Base Sepolia (testnet) → Base mainnet (soon)

\- Render (hosting)



\*\*Why x402:\*\*

AI agents need to pay for data/APIs without human intervention. x402 turns HTTP 402 into a payment rail. Agents can autonomously buy data, compute, or services.



\*\*Repos:\*\*

\- TypeScript SDK: https://github.com/Zhasulan391/sdk-typescript

\- Python SDK: https://github.com/Zhasulan391/sdk-python

\- Main repo: https://github.com/netthouse/netthouse (private, but SDKs are public)



Happy to answer questions!

