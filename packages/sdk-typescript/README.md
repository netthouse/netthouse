# @netthouse/sdk

> Pay for HTTP resources with USDC — in one line of code.

TypeScript client for the [x402 payment protocol](https://www.x402.org). Handles the full payment loop automatically: discover paid resources → get HTTP 402 → sign an EIP-3009 authorization → retry with `X-PAYMENT` → consume.

No accounts. No API keys. No invoices. Just a wallet and a fetch.

## Install

```bash
npm install @netthouse/sdk
```

## Quickstart

```typescript
import { createX402Client } from "@netthouse/sdk";

const client = createX402Client({
  privateKey: process.env.WALLET_PRIVATE_KEY as `0x${string}`,
});

// Any paid URL. SDK pays automatically on HTTP 402.
const { response, paid } = await client.fetch(
  "https://netthouse-api.onrender.com/premium/data"
);

if (response.ok) {
  const data = await response.json();
  console.log(data);         // the paid resource
  console.log("paid:", paid); // true
}
```

## Discover paid resources

Ask a server what it sells before paying:

```typescript
const catalog = await client.discover("https://netthouse-api.onrender.com");

for (const item of catalog) {
  const req = item.accepts[0];
  const price = Number(req.maxAmountRequired) / 1_000_000; // USDC has 6 decimals
  console.log(`${item.resource} — ${price} USDC on ${req.network}`);
}
// → /premium/data — 0.1 USDC on base
```

## API

### `createX402Client(config)`

| Field | Type | Description |
|---|---|---|
| `privateKey` | `0x${string}` | Private key of the payer wallet (USDC holder) |

Returns an `X402Client` instance.

### `client.fetch(url, init?)`

Performs a normal `fetch`. If the server responds **402 Payment Required**, the SDK:

1. reads payment requirements from the response,
2. selects a USDC requirement for Base networks,
3. signs an EIP-3009 `transferWithAuthorization` off-chain,
4. retries the request with the `X-PAYMENT` header.

Returns `{ response: Response, paid: boolean, paymentHeader?: string }`.

### `client.discover(baseUrl)`

Fetches `GET {baseUrl}/discover` and returns `DiscoveredResource[]` per the x402 discovery spec.

### `client.address`

The payer wallet address (`0x...`).

## How x402 works

```
agent                     server                    facilitator
  |  GET /resource           |                            |
  |------------------------->|                            |
  |      402 + requirements  |                            |
  |<-------------------------|                            |
  |  sign EIP-3009 (off-chain)                            |
  |  GET /resource + X-PAYMENT                            |
  |------------------------->|  verify + settle           |
  |                          |--------------------------->|
  |                          |     on-chain USDC transfer |
  |        200 + resource    |                            |
  |<-------------------------|                            |
```

- **Scheme:** `exact` (fixed price per request)
- **Asset:** USDC on Base (mainnet) / Base Sepolia (testnet)
- **Gas:** paid by the facilitator — the seller receives USDC gasless

## Networks

| Network | Chain ID | USDC |
|---|---|---|
| Base (mainnet) | 8453 | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| Base Sepolia | 84532 | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |

## Security

- Never commit private keys. Use environment variables or a secret manager.
- The payer wallet only signs transfer authorizations for the exact amounts it chooses to pay.
- Verify `txHash` from server responses on [basescan.org](https://basescan.org) if you need independent proof of payment.

## Live demo

```bash
git clone https://github.com/netthouse/netthouse
cd netthouse/apps/api
X402_BUYER_PRIVATE_KEY=0x... node scripts/demo-agent.mjs
```

Full docs: [netthouse.com/docs](https://netthouse.com/docs)

## License

MIT © 2026 Netthouse