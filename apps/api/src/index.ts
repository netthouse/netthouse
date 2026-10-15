import Fastify from "fastify";
import cors from "@fastify/cors";
import agentRoutes from "./routes/agents.js";
import accountRoutes from "./routes/accounts.js";
import transactionRoutes from "./routes/transactions.js";
import premiumRoutes from "./routes/premium.js";
import clearingRoutes from "./routes/clearing.js";
import apiKeyRoutes from "./routes/api-keys.js";
import { organizationRoutes } from "./routes/organizations.js";

const server = Fastify({ logger: true });

await server.register(cors, {
  origin: [
    "http://localhost:3000",
    "https://localhost:3000",
    /^https:\/\/.*\.vercel\.app$/,
    /^https:\/\/.*\.onrender\.com$/,
    /^https:\/\/(www\.)?netthouse\.com$/,
    /^https:\/\/app\.netthouse\.com$/,
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Payment",
    "X-User-Id",
  ],
  credentials: true,
});

server.get("/health", async () => {
  return {
    status: "ok",
    service: "netthouse-api",
    time: new Date().toISOString(),
  };
});

server.get("/", async () => {
  return { name: "Netthouse API", version: "0.1.0" };
});

await server.register(organizationRoutes);
await server.register(agentRoutes);
await server.register(accountRoutes);
await server.register(transactionRoutes);
await server.register(premiumRoutes);
await server.register(clearingRoutes);
await server.register(apiKeyRoutes);

const port = Number(process.env.API_PORT ?? 3001);
const host = process.env.API_HOST ?? "0.0.0.0";

try {
  await server.listen({ port, host });
  console.log(`🚀 Netthouse API running on http://${host}:${port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}