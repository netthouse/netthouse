import "dotenv/config";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { exact } from "x402/schemes";

const BUYER_PRIVATE_KEY = process.env.X402_BUYER_PRIVATE_KEY;
const API_URL = "http://localhost:3001";

if (!BUYER_PRIVATE_KEY) {
  console.error("❌ X402_BUYER_PRIVATE_KEY не задан в .env");
  process.exit(1);
}

const buyerAccount = privateKeyToAccount(BUYER_PRIVATE_KEY);
const buyerClient = createWalletClient({
  account: buyerAccount,
  chain: baseSepolia,
  transport: http(),
});

async function main() {
  console.log("🤖 Агент начинает запрос к премиум-данным...\n");

  // 1. Первый запрос без платежа
  console.log("1️⃣  GET /premium/data (без X-PAYMENT)");
  const res1 = await fetch(`${API_URL}/premium/data`);
  console.log(`   Статус: ${res1.status}`);

  if (res1.status !== 402) {
    console.error("❌ Ожидался 402, получен", res1.status);
    process.exit(1);
  }

  const body1 = await res1.json();
  console.log("   Сервер требует оплату:", body1.requirements);

  // 2. Создание подписанного платежа
  console.log("\n2️⃣  Подписание платежа EIP-3009...");
  const paymentPayload = await exact.evm.createPayment(
    buyerClient,
    1,
    body1.requirements
  );
  const paymentHeader = exact.evm.encodePayment(paymentPayload);
  console.log("   ✅ Платёж подписан");

  // 3. Повторный запрос с X-PAYMENT
  console.log("\n3️⃣  GET /premium/data (с X-PAYMENT)");
  const res2 = await fetch(`${API_URL}/premium/data`, {
    headers: { "X-PAYMENT": paymentHeader },
  });
  console.log(`   Статус: ${res2.status}`);

  const body2 = await res2.json();
  console.log("   Ответ:", body2);

  // 4. Итог
  console.log("\n🎉 Демо завершено!");
  console.log(`   💰 Оплачено: ${body2.pricePaid}`);
  console.log(`   🔗 TxHash: ${body2.txHash}`);
  console.log(`   📊 Данные: ${body2.data}`);
}

main().catch((err) => {
  console.error("❌ Ошибка:", err.message);
  process.exit(1);
});