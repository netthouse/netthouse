import "dotenv/config";
import { createX402Client } from "@netthouse/sdk";

const API_URL = process.env.API_URL ?? "http://localhost:3001";
const BUYER_PK = process.env.X402_BUYER_PRIVATE_KEY;

if (!BUYER_PK) {
  console.error("X402_BUYER_PRIVATE_KEY is not set in .env");
  process.exit(1);
}

const client = createX402Client({ privateKey: BUYER_PK });

async function main() {
  console.log("🤖 Агент начинает сессию...\n");
  console.log(`   Адрес агента: ${client.address}`);
  console.log(`   API:          ${API_URL}\n`);

  // Шаг 1: discover — агент узнаёт, что можно купить
  console.log("1️⃣  GET /discover (каталог ресурсов)");
  const catalog = await client.discover(API_URL);
  if (catalog.length === 0) {
    console.error("   ❌ Каталог пуст — агенту нечего купить");
    process.exit(1);
  }
  console.log(`   Найдено ресурсов: ${catalog.length}`);
  for (const item of catalog) {
    const req = item.accepts[0];
    const price = (Number(req.maxAmountRequired) / 1_000_000).toFixed(2);
    console.log(`   • ${item.resource}  —  ${price} USDC on ${req.network}`);
  }

  // Шаг 2: выбираем первый USDC-ресурс на base-sepolia
    const NETWORK = process.env.X402_NETWORK ?? "base";
  const target = catalog.find((i) =>
    i.accepts.some((r) => r.network === NETWORK && r.asset)
  );
  if (!target) {
    console.error(`   ❌ Нет подходящего ресурса (USDC on ${NETWORK})`);
    process.exit(1);
  }
  const targetUrl = `${API_URL.replace(/\/$/, "")}${target.resource}`;
  console.log(`\n   → Выбран: ${target.resource}`);

  // Шаг 3: fetch с автооплатой
  console.log(`\n2️⃣  GET ${target.resource} (SDK сам подпишет и заплатит при 402)`);
  const result = await client.fetch(targetUrl);

  if (!result.response.ok) {
    console.error(`   ❌ Запрос провалился: HTTP ${result.response.status}`);
    const err = await result.response.text();
    console.error("   Ответ:", err);
    process.exit(1);
  }

  const data = await result.response.json();
  console.log(`   ✅ Статус: ${result.response.status}`);
  console.log(`   💰 Оплачено: ${result.paid ? "да" : "нет (кэш?)"}`);
  console.log(`\n3️⃣  Данные от API:`);
  console.log("   ", JSON.stringify(data, null, 2).split("\n").join("\n    "));

  console.log("\n🎉 Демо завершено! Полный цикл: discover → select → pay → consume");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});