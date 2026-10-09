import Fastify from "fastify";
import cors from "@fastify/cors";

const server = Fastify({ logger: true });

await server.register(cors, { origin: true });

server.get("/health", async () => {
  return { status: "ok", service: "netthouse-api", time: new Date().toISOString() };
});

server.get("/", async () => {
  return { name: "Netthouse API", version: "0.1.0" };
});

const port = Number(process.env.API_PORT ?? 3001);
const host = process.env.API_HOST ?? "0.0.0.0";

try {
  await server.listen({ port, host });
  console.log(`🚀 Netthouse API running on http://${host}:${port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}