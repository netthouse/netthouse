import { FastifyRequest, FastifyReply } from "fastify";
import { exact } from "x402/schemes";
import { useFacilitator } from "x402/verify";
import type { PaymentRequirements } from "x402/types";
import { db, x402Payments } from "@netthouse/db";

const USDC_BASE_SEPOLIA = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
const SELLER_ADDRESS = process.env.X402_SELLER_ADDRESS as string;

if (!SELLER_ADDRESS) {
  throw new Error("X402_SELLER_ADDRESS must be set in .env");
}

// Публичный facilitator от x402.org — верифицирует подписи и проводит платежи
const facilitator = useFacilitator();

export interface X402Config {
  amount: string;
  description: string;
  orgId?: string;
}

export async function x402Middleware(
  request: FastifyRequest,
  reply: FastifyReply,
  config: X402Config
): Promise<boolean> {
  const paymentHeader = request.headers["x-payment"] as string | undefined;

  const requirements: PaymentRequirements = {
    scheme: "exact",
    network: "base-sepolia",
    payTo: SELLER_ADDRESS,
    maxAmountRequired: config.amount,
    resource: request.url,
    description: config.description,
    mimeType: "application/json",
    maxTimeoutSeconds: 60,
    asset: USDC_BASE_SEPOLIA,
    extra: {
      name: "USDC",
      version: "2",
    },
  };

  if (!paymentHeader) {
    reply
      .status(402)
      .header("X-PAYMENT-REQUIREMENTS", JSON.stringify(requirements))
      .send({
        error: "Payment required",
        message: "Please provide X-PAYMENT header",
        requirements,
      });
    return false;
  }

  try {
    const payload = exact.evm.decodePayment(paymentHeader);

    // Верификация подписи через facilitator
    const verification = await facilitator.verify(payload, requirements);

    if (!verification.isValid) {
      reply.status(402).send({
        error: "Invalid payment",
        reason: verification.invalidReason,
      });
      return false;
    }

    // Проведение платежа через facilitator (он сам платит газ)
    const settleResponse = await facilitator.settle(payload, requirements);

    if (!settleResponse.success) {
      reply.status(402).send({
        error: "Settlement failed",
        reason: settleResponse.errorReason,
      });
      return false;
    }

        const txHash = settleResponse.transaction ?? "";

    // Записываем платёж в БД
    try {
      await db.insert(x402Payments).values({
        orgId: config.orgId ?? null,
        txHash,
        fromAddress: payload.payload.authorization.from,
        toAddress: requirements.payTo,
        amount: config.amount,
        network: "base-sepolia",
        resource: requirements.resource,
        description: config.description,
      });
    } catch (err) {
      console.error("Failed to persist x402 payment:", err);
    }

    (request as any).x402Payment = {
      payload,
      txHash,
      amount: config.amount,
      fromAddress: payload.payload.authorization.from,
    };

    return true;
  } catch (err) {
    reply.status(402).send({
      error: "Payment verification failed",
      message: err instanceof Error ? err.message : "Unknown error",
    });
    return false;
  }
}