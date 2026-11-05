import "dotenv/config";
import { and, eq, sql } from "drizzle-orm";
import { db, x402Payments, organizations } from "./index.js";

const SUSPENSION_THRESHOLD_DAYS = 30;
const MIN_UNPAID_AMOUNT = 1000; // 0.001 USDC (1000 / 1_000_000)

export async function checkAndSuspendOrganizations() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - SUSPENSION_THRESHOLD_DAYS);

  // Находим все организации с неоплаченными комиссиями старше 30 дней
  const debts = await db
    .select({
      orgId: x402Payments.orgId,
      totalUnpaid: sql<string>`SUM(${x402Payments.feeAmount})`,
      oldestPayment: sql<string>`MIN(${x402Payments.createdAt})`,
    })
    .from(x402Payments)
    .where(
      and(
        eq(x402Payments.commissionPaid, false),
        sql`${x402Payments.createdAt} < ${cutoffDate.toISOString()}`
      )
    )
    .groupBy(x402Payments.orgId)
    .having(sql`SUM(${x402Payments.feeAmount}) > ${MIN_UNPAID_AMOUNT}`);

  let suspended = 0;
  let unsuspended = 0;

  for (const debt of debts) {
    if (!debt.orgId) continue;

    const totalUnpaid = Number(debt.totalUnpaid);
    const reason = `Unpaid commission: ${(totalUnpaid / 1_000_000).toFixed(6)} USDC since ${debt.oldestPayment}`;

    const result = await db
      .update(organizations)
      .set({
        isSuspended: true,
        suspendedAt: new Date(),
        suspensionReason: reason,
      })
      .where(
        and(
          eq(organizations.id, debt.orgId),
          eq(organizations.isSuspended, false)
        )
      )
      .returning();

    if (result.length > 0) {
      suspended++;
      console.log(`✅ Suspended org ${debt.orgId}: ${reason}`);
    }
  }

  // Разблокируем организации, которые оплатили долг
  const unsuspendResult = await db
    .update(organizations)
    .set({
      isSuspended: false,
      suspendedAt: null,
      suspensionReason: null,
    })
    .where(
      and(
        eq(organizations.isSuspended, true),
        sql`NOT EXISTS (
          SELECT 1 FROM ${x402Payments}
          WHERE ${x402Payments.orgId} = ${organizations.id}
          AND ${x402Payments.commissionPaid} = false
          AND ${x402Payments.feeAmount} > 0
        )`
      )
    )
    .returning();

  unsuspended = unsuspendResult.length;
  if (unsuspended > 0) {
    console.log(`✅ Unsuspended ${unsuspended} organizations (debts paid)`);
  }

  return { suspended, unsuspended, totalDebts: debts.length };
}

// Запуск из командной строки
if (process.argv[1]?.endsWith("check-suspensions")) {
  checkAndSuspendOrganizations()
    .then((result) => {
      console.log("\n📊 Result:", result);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error:", err);
      process.exit(1);
    });
}