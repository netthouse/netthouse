import { privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";
import { exact } from "x402/schemes";
import type { PaymentRequirements } from "x402/types";
import { selectPaymentRequirements } from "x402/client";

export interface X402ClientConfig {
  privateKey: `0x${string}`;
}

export interface X402FetchResult {
  response: Response;
  paid: boolean;
  paymentHeader?: string;
}

export interface DiscoveredResource {
  resource: string;
  type: "http";
  x402Version: number;
  accepts: PaymentRequirements[];
  lastUpdated: string;
}

export interface DiscoveryResponse {
  x402Version: number;
  items: DiscoveredResource[];
  pagination: { limit: number; offset: number; total: number };
}

/**
 * Клиент x402:
 *  - discover(baseUrl): получить каталог платных ресурсов
 *  - fetch(url): сделать fetch, при ответе 402 автоматически подписать и оплатить
 */
export class X402Client {
  private readonly account: PrivateKeyAccount;

  constructor(config: X402ClientConfig) {
    this.account = privateKeyToAccount(config.privateKey);
  }

  get address(): `0x${string}` {
    return this.account.address;
  }

  /**
   * Запрашивает каталог платных ресурсов у API.
   * Опционально фильтрует по сети и схеме.
   */
  async discover(baseUrl: string): Promise<DiscoveredResource[]> {
    const url = baseUrl.replace(/\/$/, "") + "/discover";
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Discover failed: HTTP ${res.status}`);
    }
    const data = (await res.json()) as DiscoveryResponse;
    return data.items;
  }

  /**
   * Делает fetch, при 402 автоматически подписывает платёж EIP-3009
   * и повторяет запрос с заголовком X-PAYMENT.
   */
  async fetch(url: string, init?: RequestInit): Promise<X402FetchResult> {
    const first = await fetch(url, init);
    if (first.status !== 402) {
      return { response: first, paid: false };
    }

    const body = (await first.json()) as { requirements?: PaymentRequirements[] | PaymentRequirements };
    const raw = body.requirements;
    if (!raw) {
      return { response: first, paid: false };
    }

    const requirements = Array.isArray(raw)
      ? selectPaymentRequirements(raw, ["base-sepolia"], "exact")
      : raw;

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