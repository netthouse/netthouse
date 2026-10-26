import { FastifyInstance } from "fastify";
import { x402Middleware } from "../middleware/x402.js";

const NETWORK = process.env.X402_NETWORK ?? "base-sepolia";

export default async function premiumRoutes(fastify: FastifyInstance) {
  // === Helper для создания платного роута ===
  const paidRoute = (priceMicro: string, description: string, dataFn: () => any) => {
    return async (request: any, reply: any) => {
      const paid = await x402Middleware(request, reply, {
        amount: priceMicro,
        description,
      });
      if (!paid) return;

      const payment = request.x402Payment;
      const priceUSDC = (Number(payment.amount) / 1_000_000).toFixed(2);

      return {
        data: dataFn(),
        pricePaid: priceUSDC + " USDC",
        txHash: payment.txHash,
        payer: payment.from,
        network: NETWORK,
        paidAt: new Date().toISOString(),
      };
    };
  };

  // === /premium/data — 0.10 USDC ===
  fastify.get(
    "/premium/data",
    paidRoute("100000", "Premium data access", () => ({
      type: "market-insights",
      summary: "AI agent payments grew 340% in 2026",
      highlights: [
        "Machine-to-machine payments hit $2.1B volume in Q3",
        "Top use case: autonomous trading agents",
        "Average agent spend: $0.47/day on data APIs",
      ],
    }))
  );

  // === /market-data — 0.05 USDC ===
  fastify.get(
    "/market-data",
    paidRoute("50000", "Crypto market snapshot", () => ({
      timestamp: new Date().toISOString(),
      assets: [
        { symbol: "BTC", price: 84530.12, change24h: 2.3 },
        { symbol: "ETH", price: 3421.88, change24h: -0.8 },
        { symbol: "USDC", price: 1.0, change24h: 0.0 },
        { symbol: "SOL", price: 187.45, change24h: 4.1 },
      ],
      source: "netthouse aggregator",
    }))
  );

  // === /agent-news — 0.10 USDC ===
  fastify.get(
    "/agent-news",
    paidRoute("100000", "AI agent ecosystem news", () => ({
      date: new Date().toISOString().slice(0, 10),
      headlines: [
        {
          title: "Coinbase launches x402 protocol on Base mainnet",
          impact: "high",
          category: "infrastructure",
        },
        {
          title: "LangChain integrates native USDC payment support",
          impact: "high",
          category: "tooling",
        },
        {
          title: "Autonomous trading agents AUM crosses $500M",
          impact: "medium",
          category: "market",
        },
        {
          title: "New EIP-7702 bundling reduces agent gas costs by 60%",
          impact: "medium",
          category: "research",
        },
      ],
    }))
  );

  // === /fx-rates — 0.25 USDC ===
  fastify.get(
    "/fx-rates",
    paidRoute("250000", "Real-time FX rates for agents", () => ({
      base: "USD",
      timestamp: new Date().toISOString(),
      rates: {
        EUR: 0.9214,
        GBP: 0.7832,
        JPY: 152.41,
        CNY: 7.238,
        RUB: 96.72,
        KZT: 487.15,
        BTC: 0.0000118,
        ETH: 0.000292,
      },
      source: "netthouse fx oracle",
    }))
  );

  // === /premium/requirements — требования оплаты для discovery ===
  fastify.get("/premium/requirements", async (request) => {
    const SELLER_ADDRESS = process.env.X402_SELLER_ADDRESS as string;
    const USDC_ADDRESS =
      NETWORK === "base"
        ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        : "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

    return {
      scheme: "exact",
      network: NETWORK,
      payTo: SELLER_ADDRESS,
      amount: "100000",
      asset: USDC_ADDRESS,
      description: "Premium data access",
    };
  });
}