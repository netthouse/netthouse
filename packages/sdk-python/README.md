\# netthouse (Python)



> Pay for HTTP resources with USDC — in three lines of code.



Python client for the \[x402 payment protocol](https://www.x402.org). Handles the full payment loop automatically: discover paid resources → get HTTP 402 → sign an EIP-3009 authorization → retry with `X-PAYMENT` → consume.



No accounts. No API keys. No invoices. Just a wallet and a request.



\## Install



```bash

pip install netthouse

```



\## Quickstart



```python

import os

from netthouse import X402Client



client = X402Client(private\_key=os.environ\["WALLET\_PRIVATE\_KEY"])



\# Any paid URL. The SDK pays automatically on HTTP 402.

result = client.fetch("https://netthouse-api.onrender.com/premium/data")



if result.response.ok:

&#x20;   print(result.response.json())  # the paid resource

&#x20;   print("paid:", result.paid)    # True

```



\## Discover paid resources



Ask a server what it sells before paying:



```python

for item in client.discover("https://netthouse-api.onrender.com"):

&#x20;   req = item\["accepts"]\[0]

&#x20;   price = int(req\["maxAmountRequired"]) / 1\_000\_000  # USDC has 6 decimals

&#x20;   print(f"{item\['resource']} - {price} USDC on {req\['network']}")

\# /premium/data - 0.1 USDC on base-sepolia

\# /market-data - 0.05 USDC on base-sepolia

```



\## API



\### `X402Client(private\_key, timeout=30)`



| Field | Type | Description |

|---|---|---|

| `private\_key` | `str` | Private key of the payer wallet (USDC holder) |

| `timeout` | `int` | HTTP timeout in seconds |



\### `client.fetch(url, \*\*kwargs)`



Performs a GET request. If the server responds \*\*402 Payment Required\*\*, the SDK:



1\. reads payment requirements from the response,

2\. selects a USDC requirement for Base networks,

3\. signs an EIP-3009 `transferWithAuthorization` off-chain,

4\. retries the request with the `X-PAYMENT` header.



Returns a `PaymentResult(response, paid, payment\_header)`.



\### `client.discover(base\_url)`



Fetches `GET {base\_url}/discover` and returns the list of catalog items per the x402 discovery spec.



\### `client.address`



The payer wallet address (`0x...`).



\## How x402 works



```

agent                     server                    facilitator

&#x20; |  GET /resource           |                            |

&#x20; |------------------------->|                            |

&#x20; |      402 + requirements  |                            |

&#x20; |<-------------------------|                            |

&#x20; |  sign EIP-3009 (off-chain)                            |

&#x20; |  GET /resource + X-PAYMENT                            |

&#x20; |------------------------->|  verify + settle           |

&#x20; |                          |--------------------------->|

&#x20; |                          |     on-chain USDC transfer |

&#x20; |        200 + resource    |                            |

&#x20; |<-------------------------|                            |

```



\- \*\*Scheme:\*\* `exact` (fixed price per request)

\- \*\*Asset:\*\* USDC on Base (mainnet) / Base Sepolia (testnet)

\- \*\*Gas:\*\* paid by the facilitator — the seller receives USDC gasless



\## Networks



| Network | Chain ID | USDC |

|---|---|---|

| Base (mainnet) | 8453 | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |

| Base Sepolia | 84532 | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |



\## Security



\- Never commit private keys. Use environment variables or a secret manager.

\- The payer wallet only signs transfer authorizations for the exact amounts it chooses to pay.

\- Verify `txHash` from server responses on \[basescan.org](https://basescan.org) if you need independent proof of payment.



\## TypeScript SDK



Prefer Node.js? See \[@netthouse/sdk](https://www.npmjs.com/package/@netthouse/sdk).



\## License



MIT © 2026 Netthouse

