\# How We Built x402 Payments for AI Agents



\*From 402 header to USDC on-chain in 30 lines of code\*



\---



AI agents need to pay for things. Data APIs, compute, storage, other agents' services. But traditional payment systems (Stripe, PayPal) require human intervention. Credit cards, accounts, KYC — none of that works for autonomous agents.



Enter \*\*x402\*\*: a protocol that turns HTTP 402 (Payment Required) into a crypto payment rail. No accounts. No API keys. Just a wallet and a request.



We built an open-source implementation with two public SDKs (TypeScript + Python). Here's how it works.



\## The Problem



Imagine an AI agent that needs real-time market data. It calls an API. The API wants $0.05 per request. How does the agent pay?



\- \*\*Stripe?\*\* Requires account setup, API keys, human approval.

\- \*\*Crypto wallet?\*\* Requires gas, complex signing, on-chain tx for every $0.05.

\- \*\*x402?\*\* One header. One signature. Done.



\## The Architecture



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





1\. \*\*Agent\*\* requests a paid resource

2\. \*\*Server\*\* responds 402 with payment requirements (amount, network, recipient)

3\. \*\*Agent SDK\*\* signs an EIP-3009 `TransferWithAuthorization` off-chain (gasless!)

4\. \*\*Agent\*\* retries with `X-PAYMENT` header

5\. \*\*Server\*\* forwards to \*\*facilitator\*\*, which verifies the signature and settles on-chain

6\. \*\*Server\*\* returns 200 + resource



The seller receives USDC. The facilitator pays gas. The agent pays nothing extra.



\## The Code (Python)



```python

from netthouse import X402Client



client = X402Client(private\_key="0x...")



\# Any paid URL. The SDK pays automatically on HTTP 402.

result = client.fetch("https://api.example.com/market-data")



if result.response.ok:

&#x20;   print(result.response.json())  # the paid resource

&#x20;   print("paid:", result.paid)    # True



That's it. Three lines. The SDK handles discovery, signing, retry.



The Code (TypeScript)



import { X402Client } from "@netthouse/sdk";



const client = new X402Client({ privateKey: "0x..." });



const result = await client.fetch("https://api.example.com/market-data");



if (result.response.ok) {

&#x20; console.log(await result.response.json());

&#x20; console.log("paid:", result.paid);

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

Pays gas (reimbursed by the seller via a separate mechanism)

In our implementation, the facilitator is a Fastify module that runs alongside the API. For production, you'd run it as a separate service.

The Discovery

How does an agent know what resources are available and how much they cost? The /discover endpoint:



{

&#x20; "x402Version": 1,

&#x20; "items": \[

&#x20;   {

&#x20;     "resource": "/market-data",

&#x20;     "type": "http",

&#x20;     "x402Version": 1,

&#x20;     "accepts": \[

&#x20;       {

&#x20;         "scheme": "exact",

&#x20;         "network": "base-sepolia",

&#x20;         "payTo": "0x34798CCeF50aaa45194E5E20008711A5Fbfd182C",

&#x20;         "maxAmountRequired": "50000",

&#x20;         "resource": "/market-data",

&#x20;         "description": "Crypto market snapshot",

&#x20;         "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e"

&#x20;       }

&#x20;     ]

&#x20;   }

&#x20; ]

}



The agent calls /discover, sees the catalog, picks a resource, and pays.

The First Payment

We tested the Python SDK against our live API. The first payment:

Resource: /market-data ($0.05 USDC)

Network: Base Sepolia (testnet)

Transaction: https://sepolia.basescan.org/tx/0xf9f7589adeb5e10019cd95b871cb74b3b3e3b54b5940964bae2794ce912eb0e8

Status: Success ✅

The agent paid. The seller received USDC. The facilitator paid gas. Everything worked.

What's Next

Mainnet launch: Switch from Base Sepolia to Base mainnet (need ETH for facilitator gas)

More resources: Add /news, /weather, /sentiment to the catalog

Dashboard: Seller analytics (revenue, requests, popular resources)

Webhooks: Notify sellers when payments arrive

Rust SDK: For high-performance agents

Try It

TypeScript SDK: npm install @netthouse/sdk

Python SDK: pip install netthouse

Live API: https://netthouse-api.onrender.com/discover

GitHub: https://github.com/Zhasulan391/sdk-typescript

Both SDKs are MIT licensed. Both are public. Both are working.



Built with Fastify, viem, eth-account, and a lot of coffee.

