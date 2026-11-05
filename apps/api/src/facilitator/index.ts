import {
  createPublicClient,
  createWalletClient,
  http,
  type Chain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, baseSepolia } from "viem/chains";
import { verify as sdkVerify, settle as sdkSettle } from "x402/facilitator";
import type { PaymentPayload, PaymentRequirements } from "x402/types";

const NETWORK = process.env.X402_NETWORK ?? "base-sepolia";
const CHAIN: Chain = NETWORK === "base" ? base : baseSepolia;
const RPC_URL =
  NETWORK === "base"
    ? "https://mainnet.base.org"
    : "https://sepolia.base.org";

const USDC_ADDRESSES: Record<string, string> = {
  "base-sepolia": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  "base": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
};

const USDC_ADDRESS =
  process.env.X402_USDC_ADDRESS ?? USDC_ADDRESSES[NETWORK] ?? "";

/**
 * Объединённый клиент: PublicClient (readContract, verifyTypedData)
 * + WalletClient (sign, sendTransaction). Именно такой ожидает x402 SDK.
 */
function getClient() {
  const pk = process.env.X402_FACILITATOR_PRIVATE_KEY as
    | `0x${string}`
    | undefined;
  if (!pk) {
    throw new Error(
      "X402_FACILITATOR_PRIVATE_KEY not set — cannot settle payments"
    );
  }
  const account = privateKeyToAccount(pk);
  const publicClient = createPublicClient({
    chain: CHAIN,
    transport: http(RPC_URL),
  });
  const walletClient = createWalletClient({
    account,
    chain: CHAIN,
    transport: http(RPC_URL),
  });
  return { ...publicClient, ...walletClient };
}

export async function verify(
  payload: PaymentPayload,
  requirements: PaymentRequirements
) {
  const client = getClient() as any;
  return sdkVerify(client, payload, requirements);
}

export async function settle(
  payload: PaymentPayload,
  requirements: PaymentRequirements
) {
  const client = getClient() as any;
  return sdkSettle(client, payload, requirements);
}