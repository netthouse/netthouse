"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const BASE_CHAIN_ID = "0x2105";

export default function PayCommissionButton({
  feeAddress,
  amountUsdc,
  sellerAddress,
  label,
  locale,
}: {
  feeAddress: string;
  amountUsdc: string;
  sellerAddress: string;
  label: string;
  locale: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "paying" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const L =
    locale === "ru"
      ? {
          paying: "Оплачиваем... Подтвердите в MetaMask",
          done: "Оплачено! Обновляем...",
          noWallet: "MetaMask не найден. Установите расширение.",
          error: "Ошибка: ",
        }
      : {
          paying: "Paying... Confirm in MetaMask",
          done: "Paid! Refreshing...",
          noWallet: "MetaMask not found. Install the extension.",
          error: "Error: ",
        };

  async function pay() {
    if (!window.ethereum) {
      setState("error");
      setMessage(L.noWallet);
      return;
    }
    try {
      setState("paying");
      setMessage(L.paying);

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BASE_CHAIN_ID }],
        });
      } catch (switchError: any) {
        if (switchError?.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: BASE_CHAIN_ID,
                chainName: "Base",
                nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://mainnet.base.org"],
                blockExplorerUrls: ["https://basescan.org"],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }

      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const from = accounts[0];

      const amountRaw = BigInt(Math.round(Number(amountUsdc) * 1_000_000));
      const data =
        "0xa9059cbb" +
        feeAddress.toLowerCase().replace("0x", "").padStart(64, "0") +
        amountRaw.toString(16).padStart(64, "0");

      const txHash: string = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{ from, to: USDC_BASE, data }],
      });

      const res = await fetch("/api/commission/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerAddress, paymentTxHash: txHash }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "mark-paid failed");
      }

      setState("done");
      setMessage(L.done);
      setTimeout(() => router.refresh(), 1500);
    } catch (err: any) {
      setState("error");
      setMessage(L.error + (err?.message ?? String(err)));
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={pay}
        disabled={state === "paying"}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {state === "paying" ? L.paying : label}
      </button>
      {message && state !== "paying" && (
        <p className={`mt-2 text-sm ${state === "error" ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}