import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Netthouse — AI Agent Payments Platform",
  description:
    "Clearing and cost-attribution layer for AI agents. Ledger, x402, multi-currency, scoped API keys.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}