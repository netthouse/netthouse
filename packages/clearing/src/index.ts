import { eq, inArray } from "drizzle-orm";
import { db, ledgerEntries, ledgerTransactions, accounts, postTransaction } from "@netthouse/db";

type Entry = typeof ledgerEntries.$inferSelect;

export type NettingResult = {
  fromAccountId: string;
  toAccountId: string;
  netAmount: string;
};

export type ClearingProposal = {
  orgId: string;
  proposals: NettingResult[];
  grossFlow: string;
  netFlow: string;
  totalSaved: string;
};

/**
 * Вычисляет взаимные обязательства между парами счетов
 * и предлагает план платежей после взаимозачёта (netting).
 */
export async function proposeClearing(orgId: string): Promise<ClearingProposal> {
  const empty: ClearingProposal = {
    orgId,
    proposals: [],
    grossFlow: "0.00",
    netFlow: "0.00",
    totalSaved: "0.00",
  };

  const orgAccounts = await db.select().from(accounts).where(eq(accounts.orgId, orgId));
  if (orgAccounts.length === 0) return empty;

  const txs = await db
    .select()
    .from(ledgerTransactions)
    .where(eq(ledgerTransactions.orgId, orgId));
  if (txs.length === 0) return empty;

  const entries = await db
    .select()
    .from(ledgerEntries)
    .where(inArray(ledgerEntries.transactionId, txs.map((t) => t.id)));

  // Группируем проводки по транзакциям
  const byTx = new Map<string, { debits: Entry[]; credits: Entry[] }>();
  for (const e of entries) {
    let bucket = byTx.get(e.transactionId);
    if (!bucket) {
      bucket = { debits: [], credits: [] };
      byTx.set(e.transactionId, bucket);
    }
    if (e.direction === "debit") bucket.debits.push(e);
    else bucket.credits.push(e);
  }

  // Потоки между парами счетов: flow["A->B"] = сумма
  const flow = new Map<string, number>();
  for (const { debits, credits } of byTx.values()) {
    for (const d of debits) {
      for (const c of credits) {
        const key = `${d.accountId}->${c.accountId}`;
        flow.set(key, (flow.get(key) ?? 0) + Number(d.amount));
      }
    }
  }

  // Взаимозачёт по каждой паре
  const seen = new Set<string>();
  const proposals: NettingResult[] = [];
  let gross = 0;
  let net = 0;
  let saved = 0;

  for (const key of flow.keys()) {
    const sep = key.indexOf("->");
    const from = key.slice(0, sep);
    const to = key.slice(sep + 2);
    const pairKey = [from, to].sort().join("|");
    if (seen.has(pairKey)) continue;
    seen.add(pairKey);

    const ab = flow.get(`${from}->${to}`) ?? 0;
    const ba = flow.get(`${to}->${from}`) ?? 0;
    gross += ab + ba;

    const diff = ab - ba;
    saved += Math.min(ab, ba);
    net += Math.abs(diff);

    if (Math.abs(diff) > 0.000001) {
      proposals.push(
        diff > 0
          ? { fromAccountId: from, toAccountId: to, netAmount: diff.toFixed(2) }
          : { fromAccountId: to, toAccountId: from, netAmount: (-diff).toFixed(2) }
      );
    }
  }

  return {
    orgId,
    proposals,
    grossFlow: gross.toFixed(2),
    netFlow: net.toFixed(2),
    totalSaved: saved.toFixed(2),
  };
}
/**
 * Применяет предложения неттинга: создаёт реальные транзакции
 * "from → to" на сумму netAmount для каждого proposal.
 */
export async function applyClearing(orgId: string): Promise<{
  created: number;
  transactions: { id: string; description: string }[];
}> {
  const proposal = await proposeClearing(orgId);
  if (proposal.proposals.length === 0) {
    return { created: 0, transactions: [] };
  }

  const created: { id: string; description: string }[] = [];
  for (const p of proposal.proposals) {
    const description = `Clearing: ${p.fromAccountId.slice(0, 8)}… → ${p.toAccountId.slice(0, 8)}…`;
    const result = await postTransaction({
      orgId,
      description,
      entries: [
        { accountId: p.fromAccountId, direction: "debit", amount: p.netAmount },
        { accountId: p.toAccountId, direction: "credit", amount: p.netAmount },
      ],
    });
    created.push({ id: result.transaction.id, description });
  }

  return { created: created.length, transactions: created };
}