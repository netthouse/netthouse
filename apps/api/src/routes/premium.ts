import { FastifyInstance } from "fastify";
import { x402Middleware } from "../middleware/x402.js";

export default async function premiumRoutes(fastify: FastifyInstance) {
  fastify.get("/premium/data", async (request, reply) => {
   const paid = await x402Middleware(request, reply, {
  amount: "100000", // 0.10 USDC = 100000 минимальных единиц (6 decimals)
  description: "Premium data access",
});
    if (!paid) return;

    const payment = (request as any).x402Payment;

    return {
      data: "Premium market insights: AI agent payments grew 340% in 2026",
      pricePaid: (Number(payment.amount) / 1_000_000).toFixed(2) + " USDC",
      txHash: payment.txHash,
      payer: payment.from,
      network: "base-sepolia",
      paidAt: new Date().toISOString(),
    };
  });

  // Эндпоинт для получения требований оплаты (чтобы клиент знал, что платить)
  fastify.get("/premium/requirements", async (request) => {
  const SELLER_ADDRESS = process.env.X402_SELLER_ADDRESS as string;
  const USDC_BASE_SEPOLIA = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

  return {
    scheme: "exact",
    network: "base-sepolia",
    payTo: SELLER_ADDRESS,
    amount: "100000", // 0.10 USDC в минимальных единицах
    asset: USDC_BASE_SEPOLIA,
    description: "Premium data access",
  };
});
}