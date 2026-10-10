import { eq, sql } from "drizzle-orm";
import { db } from "./index.js";
import { ledgerTransactions, ledgerEntries, accounts } from "./schema.js";

export type LedgerEntry = {
  accountId: string;
  direction: "debit" | "credit";
  amount: string; // строка с числом, например "100.50"
};

export type PostTransactionInput = {
  orgId: string;
  description: string;
  entries: LedgerEntry[];
};

/**
 * Проводит транзакцию двойной записи.
 * Проверяет, что сумма дебетов = сумме кредитов.
 */
export async function postTransaction(input: PostTransactionInput) {
  const { orgId, description, entries } = input;

  if (entries.length < 2) {
    throw new Error("Transaction must have at least 2 entries");
  }

  // Проверяем баланс: сумма дебетов должна равняться сумме кредитов
  let debitSum = 0;
  let creditSum = 0;

  for (const entry of entries) {
    const amount = Number(entry.amount);
    if (amount <= 0) {
      throw new Error(`Amount must be positive: ${entry.amount}`);
    }
    if (entry.direction === "debit") {
      debitSum += amount;
    } else if (entry.direction === "credit") {
      creditSum += amount;
    } else {
      throw new Error(`Invalid direction: ${entry.direction}`);
    }
  }

  // Допускаем погрешность 0.000001 из-за float
  if (Math.abs(debitSum - creditSum) > 0.000001) {
    throw new Error(
      `Transaction not balanced: debits=${debitSum}, credits=${creditSum}`
    );
  }

  // Всё в одной БД-транзакции
  return await db.transaction(async (tx) => {
        const [transaction] = await tx
      .insert(ledgerTransactions)
      .values({ orgId, description })
      .returning();

    if (!transaction) {
      throw new Error("Failed to create transaction");
    }

    await tx.insert(ledgerEntries).values(
      entries.map((e) => ({
        transactionId: transaction.id,
        accountId: e.accountId,
        direction: e.direction,
        amount: e.amount,
      }))
    );

    return { transaction, entries };
  });
}

/**
 * Возвращает текущий баланс аккаунта.
 * balance = credit - debit (счёт пассивный)
 */
export async function getAccountBalance(accountId: string): Promise<string> {
  const [result] = await db
    .select({
      balance: sql<string>`COALESCE(SUM(CASE WHEN ${ledgerEntries.direction} = 'credit' THEN ${ledgerEntries.amount}::numeric ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN ${ledgerEntries.direction} = 'debit' THEN ${ledgerEntries.amount}::numeric ELSE 0 END), 0)`,
    })
    .from(ledgerEntries)
    .where(eq(ledgerEntries.accountId, accountId));

  return result?.balance ?? "0";
}