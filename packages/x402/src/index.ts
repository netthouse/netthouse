import { eq } from "drizzle-orm";
import { db, ledgerTransactions } from "@netthouse/db";

export type X402PaymentRequired = {
  status: 402;
  payment: {
    orgId: string;
    amount: string;
    currency: string;
    description: string;
    instructions: string;
  };
};

export type X402Config = {
  orgId: string;
  amount: string;
  currency: string;
  description: string;
};

export function createPaymentRequired(config: X402Config): X402PaymentRequired {
  return {
    status: 402,
    payment: {
      ...config,
      instructions:
        "Create a balanced transaction via POST /transactions (debit payer, credit provider), then retry this request with header X-Payment: <transaction id>",
    },
  };
}

export async function verifyPayment(
  orgId: string,
  transactionId: string
): Promise<boolean> {
  const [tx] = await db
    .select()
    .from(ledgerTransactions)
    .where(eq(ledgerTransactions.id, transactionId));

  if (!tx) {
    return false;
  }

  if (tx.orgId !== orgId) {
    return false;
  }

  return true;
}