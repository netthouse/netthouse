# How We Built x402 Payments for AI Agents on Base Mainnet

*From 402 header to USDC on-chain in 30 lines of code — with subscription tiers*

---

AI agents need to pay for things. Data APIs, compute, storage, other agents' services. But traditional payment systems (Stripe, PayPal) require human intervention. Credit cards, accounts, KYC — none of that works for autonomous agents.

Enter **x402**: a protocol from Coinbase that turns HTTP 402 (Payment Required) into a crypto payment rail. No accounts. No API keys. Just a wallet and a request.

We built an open-source implementation with two public SDKs (TypeScript + Python), running on **Base mainnet** with Stripe-powered subscription billing. Here's how it works.

## The Problem

Imagine an AI agent that needs real-time market data. It calls an API. The API wants $0.05 per request. How does the agent pay?

- **Stripe?** Requires account setup, API keys, human approval.
- **Crypto wallet?** Requires gas, complex signing, on-chain tx for every $0.05.
- **x402?** One header. One signature. Done.

## The Architecture

agent server facilitator
| GET /resource | |
|------------------------->| |
| 402 + requirements | |
|<-------------------------| |
| sign EIP-3009 (off-chain) |
| GET /resource + X-PAYMENT |
|------------------------->| verify + settle |
| |--------------------------->|
| | on-chain USDC transfer |
| 200 + resource | |
|<-------------------------| |


1. **Agent** requests a paid resource
2. **Server** responds 402 with payment requirements (amount, network, recipient)
3. **Agent SDK** signs an EIP-3009 `TransferWithAuthorization` off-chain (gasless!)
4. **Agent** retries with `X-PAYMENT` header
5. **Server** forwards to **facilitator**, which verifies the signature and settles on-chain
6. **Server** returns 200 + resource

The seller receives USDC. The facilitator pays gas. The agent pays nothing extra.

## The Code (Python)

```python
from netthouse import X402Client

client = X402Client(private_key="0x...")

# Any paid URL. The SDK pays automatically on HTTP 402.
result = client.fetch("https://api.netthouse.com/market-data")

if result.response.ok:
    print(result.response.json())  # the paid resource
    print("paid:", result.paid)    # True

That's it. Three lines. The SDK handles discovery, signing, retry.

The Code (TypeScript)

import { X402Client } from "@netthouse/sdk";

const client = new X402Client({ privateKey: "0x..." });

const result = await client.fetch("https://api.netthouse.com/market-data");

if (result.response.ok) {
  console.log(await result.response.json());
  console.log("paid:", result.paid);
}

Same API. Same flow. Different language.
The EIP-3009 Signature
The magic is in the signature. EIP-3009 TransferWithAuthorization is an off-chain authorization that a facilitator can execute on-chain. It includes:
from: payer address
to: seller address
value: amount in USDC (6 decimals)
validAfter / validBefore: time window
nonce: unique per transaction
The SDK signs this with the payer's private key. The facilitator verifies the signature and submits the on-chain transaction. The seller receives USDC. The facilitator pays gas.
The Facilitator
The facilitator is a trusted third party that:
Verifies the EIP-3009 signature
Checks the nonce hasn't been used
Submits the on-chain transaction
Pays gas (reimbursed by the seller)
In our implementation, the facilitator runs as a Fastify module alongside the API — fully local, no dependency on public facilitators.
The Discovery
How does an agent know what resources are available and how much they cost? The /discover endpoint:

{
  "x402Version": 1,
  "items": [
    {
      "resource": "/market-data",
      "type": "http",
      "x402Version": 1,
      "accepts": [
        {
          "scheme": "exact",
          "network": "base",
          "payTo": "0x9CeceD626E30b60AaFDe7DFa65b6B4BD4c674a64",
          "maxAmountRequired": "50000",
          "resource": "/market-data",
          "description": "Crypto market snapshot",
          "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        }
      ]
    }
  ]
}

The agent calls /discover, sees the catalog, picks a resource, and pays.
Subscription Tiers with Dynamic Commission
Most pay-per-request systems charge a flat fee. We added subscription tiers that reduce the platform commission for high-volume users:

Tier
Price
Commission
Free
$0
10%
Pro
$29/month
5%
Enterprise
$299/month
2%

When a Pro subscriber pays $0.05 USDC, we only take $0.0025 — the rest goes to the resource seller. Commission is computed at request time from the subscriptions table.
The flow:
User signs up via Clerk at app.netthouse.com
Subscribes via Stripe Checkout
Stripe webhook updates subscriptions table with tier and commissionPercent
x402 middleware reads the tier on every request
On-chain payment splits automatically: seller gets amount * (100 - commission)%, platform gets the rest
Dashboard in two languages (EN/RU): https://app.netthouse.com
The First Mainnet Payment
We tested the full flow on Base mainnet:
Resource: /market-data ($0.05 USDC)
Network: Base mainnet (chain ID 8453)
Transaction: 0xc177acae1afc9e6eee5bc1ab92c55d65e33b3b631ad8d83b03dfe3c5ddd659a1
Status: Success ✅
Commission: 5% (Pro tier verified on-chain)
Earlier testnet payment: 0xf9f758...2eb0e8
The agent paid. The seller received USDC. The platform took its commission. The facilitator paid gas. Everything worked end-to-end.
The Suspension Lever
Bad actors exist in any payment system. We built a kill switch:
Organizations have an is_suspended flag in the database
Suspended orgs get 403 on payment requests and disappear from /discover
A cron script (check-suspensions.ts) runs hourly to catch bad actors
Webhook events can trigger automatic suspension
No manual intervention needed.
The Stack
Fastify — Node.js API
viem + eth-account — EIP-712 signing
PostgreSQL (Neon) — double-entry ledger
Stripe — subscriptions + billing
Clerk — auth
Base mainnet (production), Base Sepolia (testnet)
Render — hosting with custom domain api.netthouse.com
Cloudflare — DNS
Try It
TypeScript SDK: npm install @netthouse/sdk — source
Python SDK: pip install netthouse — source
Live API: https://api.netthouse.com/discover
Dashboard: https://app.netthouse.com
Main repo: https://github.com/netthouse/netthouse
Both SDKs are MIT licensed. Both are public. Both work on mainnet today.
What's Next
More resources in the catalog (news, weather, sentiment)
Rust SDK for high-performance agents
Utility token NETT for discounts and governance
Partnerships with AI agent platforms (LangChain, AutoGPT, MCP community)
Built with Fastify, viem, eth-account, and a lot of coffee.
