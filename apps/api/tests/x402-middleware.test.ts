import { describe, it, expect, vi, beforeEach } from "vitest";

// Мокаем модули до импорта middleware
vi.mock("@netthouse/db", () => ({
  db: {
    insert: vi.fn(() => ({ values: vi.fn() })),
  },
  x402Payments: {},
}));

vi.mock("x402/verify", () => ({
  useFacilitator: () => ({
    verify: vi.fn(),
    settle: vi.fn(),
  }),
}));

vi.mock("../src/middleware/auth.js", () => ({
  requireAuth: vi.fn(),
}));


import { x402Middleware } from "../src/middleware/x402.js";

function makeReqReply(headers: Record<string, string> = {}) {
  const req: any = { headers, url: "/premium/data" };
  let statusCode = 200;
  const sentHeaders: Record<string, string> = {};
  let body: any = null;
  const reply: any = {
    status(code: number) {
      statusCode = code;
      return reply;
    },
    header(name: string, value: string) {
      sentHeaders[name] = value;
      return reply;
    },
    send(b: any) {
      body = b;
      return reply;
    },
  };
  return {
    req,
    reply,
    result: () => ({ statusCode, sentHeaders, body }),
  };
}

describe("x402Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 402 with requirements when X-PAYMENT header is missing", async () => {
    const { req, reply, result } = makeReqReply();
    const ok = await x402Middleware(req, reply, {
      amount: "100000",
      description: "Premium data access",
    });

    expect(ok).toBe(false);
    const { statusCode, sentHeaders, body } = result();
    expect(statusCode).toBe(402);
    expect(body.error).toBe("Payment required");
    expect(body.requirements.scheme).toBe("exact");
    expect(body.requirements.network).toBe("base-sepolia");
    expect(body.requirements.maxAmountRequired).toBe("100000");
    expect(body.requirements.asset).toBe(
      "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
    );
    expect(sentHeaders["X-PAYMENT-REQUIREMENTS"]).toBeDefined();
  });

  it("buildRequirements helper builds correct requirements", async () => {
    const { buildRequirements } = await import("../src/middleware/x402.js");
    const reqs = buildRequirements("/premium/data", {
      amount: "100000",
      description: "Test",
    });
    expect(reqs.scheme).toBe("exact");
    expect(reqs.resource).toBe("/premium/data");
    expect(reqs.maxAmountRequired).toBe("100000");
    expect(reqs.payTo).toBe(
      "0x34798CCeF50aaa45194E5E20008711A5Fbfd182C"
    );
  });
});