import {
  createPublicClient,
  createWalletClient,
  http,
  type Chain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, baseSepolia } from "viem/chains";
import { verify as sdkVerify, settle as sdkSettle } from "x402/facilitator";
import type {
  PaymentPayload,
  PaymentRequirements,
} from "x402/types";

const NETWORK = process.env.X402_NETWORK ?? "base-sepolia";
const CHAIN: Chain = NETWORK === "base" ? base : baseSepolia;
const RPC_URL =
  NETWORK === "base"
    ? "https://mainnet.base.org"
    : "https://sepolia.base.org";

/**
 * Локальный facilitator: вместо обращения к публичному x402.org
 * мы сами верифицируем подпись и сами отправляем settle-транзакцию.
 *
 * Требуется X402_FACILITATOR_PRIVATE_KEY — приватный ключ газового кошелька.
 * У него должен быть ETH (Base mainnet) или test ETH (Sepolia) для оплаты газа.
 */

function getPublicClient() {
  return createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL),
  });
}

function getSigner() {
  const pk = process.env.X402_FACILITATOR_PRIVATE_KEY as
    | `0x${string}`
    | undefined;
  if (!pk) {
    throw new Error(
      "X402_FACILITATOR_PRIVATE_KEY not set — cannot settle payments"
    );
  }
  const account = privateKeyToAccount(pk);
  return createWalletClient({
    account,
    chain: CHAIN,
    transport: http(RPC_URL),
  });
}

export async function verify(
  payload: PaymentPayload,
  requirements: PaymentRequirements
) {
  const client = getPublicClient();
  return sdkVerify(client as any, payload, requirements);
}

export async function settle(
  payload: PaymentPayload,
  requirements: PaymentRequirements
) {
  const signer = getSigner();
  return sdkSettle(signer as any, payload, requirements);
}