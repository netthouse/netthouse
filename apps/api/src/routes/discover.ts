import { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db, organizations } from "@netthouse/db";
import { buildRequirements, type X402Config } from "../middleware/x402.js";

// TODO: вынести в таблицу resources
const CATALOG: { resource: string; config: X402Config; orgId: string }[] = [
  {
    resource: "/premium/data",
    config: { amount: "100000", description: "Premium data access" },
    orgId: "95f60a9c-6f41-48b2-87fe-b13f9ee61871",
  },
  {
    resource: "/market-data",
    config: { amount: "50000", description: "Crypto market snapshot" },
    orgId: "95f60a9c-6f41-48b2-87fe-b13f9ee61871",
  },
  {
    resource: "/agent-news",
    config: { amount: "100000", description: "AI agent ecosystem news" },
    orgId: "95f60a9c-6f41-48b2-87fe-b13f9ee61871",
  },
  {
    resource: "/fx-rates",
    config: { amount: "250000", description: "Real-time FX rates for agents" },
    orgId: "95f60a9c-6f41-48b2-87fe-b13f9ee61871",
  },
];

export default async function discoverRoutes(fastify: FastifyInstance) {
  fastify.get("/discover", async () => {
    // Загружаем список suspended организаций
    const suspendedOrgs = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.isSuspended, true));

    const suspendedIds = new Set(suspendedOrgs.map((o) => o.id));

    // Фильтруем каталог — убираем ресурсы suspended org
    const activeCatalog = CATALOG.filter((item) => !suspendedIds.has(item.orgId));

    const items = activeCatalog.map(({ resource, config }) => ({
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