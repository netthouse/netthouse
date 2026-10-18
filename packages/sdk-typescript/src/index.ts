import { privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";
import { exact } from "x402/schemes";
import type { PaymentRequirements } from "x402/types";

export interface X402ClientConfig {
  privateKey: `0x${string}`;
  rpcUrl?: string;
}

export interface X402FetchResult {
  response: Response;
  paid: boolean;
  paymentHeader?: string;
}

/**
 * Клиент x402: делает fetch, а при ответе 402 автоматически
 * подписывает платёж EIP-3009 и повторяет запрос с заголовком X-PAYMENT.
 */
export class X402Client {
  private readonly account: PrivateKeyAccount;

  constructor(config: X402ClientConfig) {
    this.account = privateKeyToAccount(config.privateKey);
    }

  get address(): `0x${string}` {
    return this.account.address;
  }

  async fetch(url: string, init?: RequestInit): Promise<X402FetchResult> {
    const first = await fetch(url, init);
    if (first.status !== 402) {
      return { response: first, paid: false };
    }

    const body = (await first.json()) as { requirements?: PaymentRequirements };
    const requirements = body.requirements;
    if (!requirements) {
      return { response: first, paid: false };
    }

    const payload = await exact.evm.createPayment(this.account, 1, requirements);
    const paymentHeader = exact.evm.encodePayment(payload);

    const headers = new Headers(init?.headers);
    headers.set("X-PAYMENT", paymentHeader);

    const second = await fetch(url, { ...init, headers });
    return { response: second, paid: true, paymentHeader };
  }
}

export function createX402Client(config: X402ClientConfig): X402Client {
  return new X402Client(config);
}