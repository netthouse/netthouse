import { FastifyInstance } from "fastify";
import { buildRequirements, type X402Config } from "../middleware/x402.js";

// Каталог платных ресурсов. Здесь же в будущем появятся новые тарифы.
const CATALOG: { resource: string; config: X402Config }[] = [
  {
    resource: "/premium/data",
    config: { amount: "100000", description: "Premium data access" },
  },
];

export default async function discoverRoutes(fastify: FastifyInstance) {
  // Публичный эндпоинт: агент узнаёт, что у нас можно купить и по какой цене
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