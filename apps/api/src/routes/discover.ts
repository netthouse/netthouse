import { FastifyInstance } from "fastify";
import { buildRequirements, type X402Config } from "../middleware/x402.js";

// Каталог платных ресурсов
const CATALOG: { resource: string; config: X402Config }[] = [
  {
    resource: "/premium/data",
    config: { amount: "100000", description: "Premium data access" },
  },
  {
    resource: "/market-data",
    config: { amount: "50000", description: "Crypto market snapshot" },
  },
  {
    resource: "/agent-news",
    config: { amount: "100000", description: "AI agent ecosystem news" },
  },
  {
    resource: "/fx-rates",
    config: { amount: "250000", description: "Real-time FX rates for agents" },
  },
];

export default async function discoverRoutes(fastify: FastifyInstance) {
  fastify.get("/discover", async () => {
    const items = CATALOG.map(({ resource, config }) => ({
      resource,
      type: "http" as const,
      x402Version: 1,
      accepts: [buildRequirements(resource, config)],
      lastUpdated: new Date().toISOString(),
    }));

    return {
      x402Version: 1,
      items,
      pagination: { limit: items.length, offset: 0, total: items.length },
    };
  });
}