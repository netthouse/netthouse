import Link from "next/link";

const API = "https://netthouse-api.onrender.com";

function Code({ children, lang = "bash" }: { children: string; lang?: string }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 rounded-t-lg border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400">{lang}</span>
      </div>
      <pre className="p-4 bg-slate-900 text-slate-100 rounded-b-lg text-xs overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <img src="/netthouse-horizontal-color.svg" alt="Netthouse" className="h-8 w-auto" />
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/#features" className="text-slate-600 hover:text-slate-900">
              Features
            </Link>
            <Link href="/docs" className="text-slate-900 font-medium">
              Docs
            </Link>
            <a
              href="https://app.netthouse.com"
              className="text-slate-600 hover:text-slate-900"
            >
              Sign in
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="hidden lg:block">
          <nav className="space-y-2 text-sm sticky top-24">
            <a href="#introduction" className="block text-slate-600 hover:text-slate-900">Introduction</a>
            <a href="#quickstart" className="block text-slate-600 hover:text-slate-900">Quickstart</a>
            <a href="#typescript" className="block text-slate-600 hover:text-slate-900">TypeScript SDK</a>
            <a href="#python" className="block text-slate-600 hover:text-slate-900">Python</a>
            <a href="#curl" className="block text-slate-600 hover:text-slate-900">curl (under the hood)</a>
            <a href="#x402" className="block text-slate-600 hover:text-slate-900">x402 protocol</a>
            <a href="#api" className="block text-slate-600 hover:text-slate-900">API reference</a>
            <a href="#live" className="block text-slate-600 hover:text-slate-900">Live catalog</a>
          </nav>
        </aside>

        <main className="lg:col-span-3 space-y-14">
          <section id="introduction">
            <h1 className="text-3xl font-bold">Introduction</h1>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Netthouse is a payments infrastructure for AI agents. It gives you HTTP-native
              payments (x402), a double-entry ledger, and automatic netting of opposing money
              flows — so agents can pay for resources without invoices, sessions, or manual wiring.
            </p>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <b>New:</b> x402 payments are now live. Your agents can pay for API calls in USDC
                with a single HTTP header — no accounts, no registration, no KYC.
              </p>
            </div>
          </section>

          <section id="quickstart">
            <h2 className="text-2xl font-bold">Quickstart (3 steps)</h2>
            <p className="mt-4 text-slate-600">
              Pay for a premium API call in 3 lines of code. No account creation, no OAuth, no invoices.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">1. Install the SDK</h3>
                <Code lang="bash">{`npm install @netthouse/sdk`}</Code>
                <p className="mt-2 text-sm text-slate-500">
                  Or from GitHub: <code className="px-2 py-1 bg-slate-100 rounded text-xs">npm install github:netthouse/sdk-typescript</code>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">2. Create a wallet</h3>
                <Code lang="typescript">{`import { generatePrivateKey } from "viem/accounts";
const privateKey = generatePrivateKey(); // 0x...`}</Code>
                <p className="mt-2 text-sm text-slate-500">
                  Fund it with USDC on Base (mainnet or Sepolia testnet).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">3. Pay and consume</h3>
                <Code lang="typescript">{`import { createX402Client } from "@netthouse/sdk";

const client = createX402Client({ privateKey });
const result = await client.fetch("${API}/premium/data");

if (result.response.ok) {
  const data = await result.response.json();
  console.log(data); // Premium market insights...
  console.log("Paid:", result.paid); // true
}`}</Code>
                <p className="mt-2 text-sm text-slate-500">
                  SDK automatically handles 402 → signs EIP-3009 → retries with X-PAYMENT.
                </p>
              </div>
            </div>
          </section>

          <section id="typescript">
            <h2 className="text-2xl font-bold">TypeScript SDK</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Full example: discover available resources, select one, pay, and consume.
            </p>

            <Code lang="typescript">{`import { createX402Client } from "@netthouse/sdk";

const API_URL = "https://netthouse-api.onrender.com";
const client = createX402Client({
  privateKey: process.env.BUYER_PRIVATE_KEY as \`0x\${string}\`,
});

// 1. Discover what's available
const catalog = await client.discover(API_URL);
console.log("Found resources:", catalog.length);
// → Found resources: 1
// → • /premium/data — 0.10 USDC on base

// 2. Select a resource (first one with USDC on Base)
const target = catalog.find(i =>
  i.accepts.some(r => r.network === "base" && r.asset)
);
const url = \`\${API_URL}\${target.resource}\`;

// 3. Fetch with auto-payment
const result = await client.fetch(url);

if (result.response.ok) {
  const data = await result.response.json();
  console.log("✓ Status:", result.response.status);
  console.log("✓ Paid:", result.paid);
  console.log("✓ Data:", data);
  // → { data: "Premium market insights...", txHash: "0x..." }
}`}</Code>

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">API Reference</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><code className="px-2 py-1 bg-white rounded text-xs">client.discover(baseUrl)</code> → <code>DiscoveredResource[]</code></li>
                <li><code className="px-2 py-1 bg-white rounded text-xs">client.fetch(url, init?)</code> → <code>{`{ response: Response, paid: boolean, paymentHeader?: string }`}</code></li>
                <li><code className="px-2 py-1 bg-white rounded text-xs">client.address</code> → <code>0x${`{string}`}</code></li>
              </ul>
            </div>
          </section>

          <section id="python">
            <h2 className="text-2xl font-bold">Python</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              No official Python SDK yet, but x402 is HTTP-native. Here's how to do it with <code>requests</code> and <code>web3.py</code>:
            </p>

            <Code lang="python">{`import requests
from web3 import Web3
from eth_account import Account

# Setup
API_URL = "https://netthouse-api.onrender.com"
PRIVATE_KEY = "0x..."  # Your buyer wallet
w3 = Web3(Web3.HTTPProvider("https://sepolia.base.org"))
account = Account.from_key(PRIVATE_KEY)

# 1. First request → get 402 with requirements
resp = requests.get(f"{API_URL}/premium/data")
assert resp.status_code == 402

requirements = resp.json()["requirements"]
# → { scheme: "exact", network: "base", payTo: "0x...", maxAmountRequired: "100000", ... }

# 2. Sign EIP-3009 authorization (off-chain signature for USDC transfer)
# This is the complex part — use x402-python SDK when available
# For now, use the TypeScript SDK or raw web3.py signing

# 3. Retry with X-PAYMENT header
payment_header = "<signed_payload>"  # From step 2
resp = requests.get(
    f"{API_URL}/premium/data",
    headers={"X-PAYMENT": payment_header}
)

if resp.status_code == 200:
    data = resp.json()
    print("✓ Paid and received:", data)
    # → { data: "Premium market insights...", txHash: "0x..." }`}</Code>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <b>Note:</b> EIP-3009 signing is non-trivial. We're building an official Python SDK.
                For now, use the TypeScript SDK or see the <a href="#curl" className="underline">curl example</a> for the raw protocol.
              </p>
            </div>
          </section>

          <section id="curl">
            <h2 className="text-2xl font-bold">curl (under the hood)</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              See how x402 works at the HTTP level. Four requests, one payment.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">1. Discover available resources</h3>
                <Code>{`curl ${API}/discover

# Response:
{
  "x402Version": 1,
  "items": [
    {
      "resource": "/premium/data",
      "type": "http",
      "accepts": [
        {
          "scheme": "exact",
          "network": "base",
          "payTo": "0x9CeceD626E30b60AaFDe7DFa65b6B4BD4c674a64",
          "maxAmountRequired": "100000",
          "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        }
      ]
    }
  ]
}`}</Code>
              </div>

              <div>
                <h3 className="text-lg font-semibold">2. Request the resource → get 402</h3>
                <Code>{`curl -i ${API}/premium/data

# Response:
HTTP/1.1 402 Payment Required
x-payment-requirements: {"scheme":"exact","network":"base",...}

{
  "error": "Payment required",
  "requirements": { ... }
}`}</Code>
              </div>

              <div>
                <h3 className="text-lg font-semibold">3. Sign EIP-3009 and build X-PAYMENT header</h3>
                <Code>{`# This is the complex part — use SDK or x402 library
# The header contains:
# - authorization: EIP-712 signed transfer authorization
# - signature: ECDSA signature from buyer wallet
# - network, scheme, payTo, etc.

PAYMENT_HEADER="<base64-encoded-payment-payload>"`}</Code>
              </div>

              <div>
                <h3 className="text-lg font-semibold">4. Retry with X-PAYMENT → get 200</h3>
                <Code>{`curl -H "X-PAYMENT: $PAYMENT_HEADER" ${API}/premium/data

# Response:
HTTP/1.1 200 OK

{
  "data": "Premium market insights: AI agent payments grew 340% in 2026",
  "pricePaid": "0.10 USDC",
  "txHash": "0xad6259b0f3de40b2229bb313ff03d382271b08f7ffd0492fd82429c6675da67a",
  "network": "base",
  "paidAt": "2026-10-19T09:32:39.220Z"
}`}</Code>
                <p className="mt-2 text-sm text-slate-500">
                  Check the transaction: <a href="https://basescan.org/tx/0xad6259b0f3de40b2229bb313ff03d382271b08f7ffd0492fd82429c6675da67a" className="text-blue-600 hover:underline" target="_blank">basescan.org/tx/0xad62...a67a</a>
                </p>
              </div>
            </div>
          </section>

          <section id="x402">
            <h2 className="text-2xl font-bold">x402 protocol</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              x402 turns HTTP 402 «Payment Required» into a machine-readable payment protocol. Flow:
            </p>
            <ol className="mt-4 list-decimal list-inside space-y-2 text-slate-600">
              <li><b>Discover:</b> Agent calls <code>GET /discover</code> to see available resources and prices.</li>
              <li><b>Request:</b> Agent calls a paid resource → server responds <b>402</b> with requirements (amount, currency, recipient).</li>
              <li><b>Sign:</b> Agent signs an EIP-3009 authorization (off-chain USDC transfer permission).</li>
              <li><b>Pay:</b> Agent retries with <b>X-PAYMENT</b> header carrying the signed payload.</li>
              <li><b>Verify:</b> Server verifies signature via facilitator (x402.org).</li>
              <li><b>Settle:</b> Facilitator submits on-chain transaction (gasless for seller).</li>
              <li><b>Serve:</b> Server returns the resource + txHash.</li>
            </ol>

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Why x402?</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>✓ <b>No accounts:</b> Agent pays with a wallet, not a username/password.</li>
                <li>✓ <b>No registration:</b> No API keys, no OAuth, no onboarding flow.</li>
                <li>✓ <b>One round-trip:</b> Payment happens in the retry, not a separate API call.</li>
                <li>✓ <b>Gasless for sellers:</b> Facilitator pays gas, seller receives USDC directly.</li>
              </ul>
            </div>
          </section>

          <section id="api">
            <h2 className="text-2xl font-bold">API reference</h2>
            <div className="mt-6 overflow-hidden border border-slate-200 rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Method</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Path</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Description</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Auth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <Row m="GET" p="/discover" d="List paid resources with prices" a="Public" />
                  <Row m="GET" p="/premium/data" d="Premium data (0.10 USDC)" a="x402" />
                  <Row m="GET" p="/payments" d="List x402 payments" a="Admin" />
                  <Row m="GET" p="/health" d="API health check" a="Public" />
                  <Row m="POST" p="/organizations" d="Create organization" a="API key" />
                  <Row m="GET" p="/organizations" d="List organizations" a="API key" />
                  <Row m="POST" p="/accounts" d="Create account" a="API key" />
                  <Row m="GET" p="/accounts" d="List accounts" a="API key" />
                  <Row m="POST" p="/transactions" d="Post balanced transaction" a="API key" />
                  <Row m="GET" p="/transactions" d="List transactions" a="API key" />
                  <Row m="GET" p="/clearing" d="Clearing proposal" a="API key" />
                  <Row m="POST" p="/clearing/apply" d="Apply netting" a="API key" />
                  <Row m="POST" p="/api-keys" d="Issue API key" a="Admin" />
                  <Row m="GET" p="/api-keys" d="List API keys" a="Admin" />
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              <b>Auth methods:</b> <code>Public</code> (no auth), <code>x402</code> (X-PAYMENT header), <code>API key</code> (Authorization: Bearer), <code>Admin</code> (admin API key).
            </p>
          </section>

          <section id="live">
            <h2 className="text-2xl font-bold">Live catalog</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              See what's available right now on the production API:
            </p>
            <Code>{`curl ${API}/discover | jq`}</Code>
            <p className="mt-4 text-slate-600">
              Or try it yourself: pay 0.10 USDC for premium data and see the transaction on <a href="https://basescan.org" className="text-blue-600 hover:underline" target="_blank">basescan.org</a>.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Network</h4>
                <p className="text-sm text-slate-600">Base (mainnet) / Base Sepolia (testnet)</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Currency</h4>
                <p className="text-sm text-slate-600">USDC (0x8335...2913 on mainnet)</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Example price</h4>
                <p className="text-sm text-slate-600">0.10 USDC per API call</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Settlement</h4>
                <p className="text-sm text-slate-600">~3 seconds (Base block time)</p>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-slate-200">
            <div className="p-6 bg-slate-900 text-white rounded-lg">
              <h3 className="text-xl font-bold mb-2">Ready to build?</h3>
              <p className="text-slate-300 mb-4">
                Create an organization, issue an API key, and start accepting x402 payments from AI agents.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://app.netthouse.com"
                  className="px-6 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100"
                >
                  Open dashboard →
                </a>
                <a
                  href="https://github.com/netthouse"
                  className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 border border-slate-700"
                  target="_blank"
                >
                  GitHub →
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Row({ m, p, d, a }: { m: string; p: string; d: string; a: string }) {
  const authColor =
    a === "Public" ? "bg-green-100 text-green-700" :
    a === "x402" ? "bg-blue-100 text-blue-700" :
    a === "API key" ? "bg-slate-100 text-slate-700" :
    "bg-amber-100 text-amber-700";

  return (
    <tr>
      <td className="px-4 py-2 font-mono text-xs font-semibold text-slate-900">{m}</td>
      <td className="px-4 py-2 font-mono text-xs text-slate-600">{p}</td>
      <td className="px-4 py-2 text-slate-600">{d}</td>
      <td className="px-4 py-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${authColor}`}>
          {a}
        </span>
      </td>
    </tr>
  );
}