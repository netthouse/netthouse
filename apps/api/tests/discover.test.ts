import { describe, it, expect } from "vitest";
import Fastify from "fastify";
import discoverRoutes from "../src/routes/discover.js";

describe("GET /discover", () => {
  it("returns catalog with x402 spec structure", async () => {
    const app = Fastify();
    await app.register(discoverRoutes);

    const res = await app.inject({ method: "GET", url: "/discover" });
    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.payload) as {
      x402Version: number;
      items: Array<{
        resource: string;
        type: string;
        x402Version: number;
        accepts: Array<{
          scheme: string;
          network: string;
          payTo: string;
          maxAmountRequired: string;
          asset: string;
        }>;
        lastUpdated: string;
      }>;
      pagination: { limit: number; offset: number; total: number };
    };

    // Корневая структура
    expect(body.x402Version).toBe(1);
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
    expect(body.pagination).toMatchObject({
      offset: 0,
      total: body.items.length,
    });

    // Первый ресурс
    const first = body.items[0];
    expect(first.resource).toBe("/premium/data");
    expect(first.type).toBe("http");
    expect(first.x402Version).toBe(1);
    expect(first.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}T/);

    // Requirements в accepts
    expect(first.accepts.length).toBe(1);
    const req = first.accepts[0];
    expect(req.scheme).toBe("exact");
    expect(req.network).toBe("base-sepolia");
    expect(req.payTo).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(req.maxAmountRequired).toBe("100000");
    expect(req.asset).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });

  it("includes USDC asset address from base-sepolia", async () => {
    const app = Fastify();
    await app.register(discoverRoutes);

    const res = await app.inject({ method: "GET", url: "/discover" });
    const { items } = JSON.parse(res.payload);
    const asset = items[0].accepts[0].asset;

    // Официальный USDC на Base Sepolia
    expect(asset.toLowerCase()).toBe(
      "0x036CbD53842c5426634e7929541eC2318f3dCF7e".toLowerCase()
    );
  });
});