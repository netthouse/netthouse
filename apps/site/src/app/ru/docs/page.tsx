import Link from "next/link";

const API = "https://api.netthouse.com";

function Code({ children, lang = "bash" }: { children: string; lang?: string }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 rounded-t-lg border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400">{lang}</span>
      </div>
      <pre className="p-4 bg-slate-900 text-slate-100 rounded-b-lg text-xs overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export const metadata = {
  title: "Netthouse — Документация",
  description: "Руководство по интеграции x402-платежей для AI-агентов. TypeScript, Python, curl.",
};

export default function DocsPageRU() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/ru">
            <img src="/netthouse-horizontal-color.svg" alt="Netthouse" className="h-8 w-auto" />
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/ru/#features" className="text-slate-600 hover:text-slate-900">
              Возможности
            </Link>
            <Link href="/ru/docs" className="text-slate-900 font-medium">
              Документация
            </Link>
            <div className="flex gap-2 text-xs items-center">
              <a href="/docs" className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200">EN</a>
              <a href="/ru/docs" className="px-2 py-1 bg-slate-900 text-white rounded">RU</a>
            </div>
            <a
              href="https://app.netthouse.com"
              className="text-slate-600 hover:text-slate-900"
            >
              Войти
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="hidden lg:block">
          <nav className="space-y-2 text-sm sticky top-24">
            <a href="#introduction" className="block text-slate-600 hover:text-slate-900">Введение</a>
            <a href="#quickstart" className="block text-slate-600 hover:text-slate-900">Быстрый старт</a>
            <a href="#typescript" className="block text-slate-600 hover:text-slate-900">TypeScript SDK</a>
            <a href="#python" className="block text-slate-600 hover:text-slate-900">Python</a>
            <a href="#curl" className="block text-slate-600 hover:text-slate-900">curl (под капотом)</a>
            <a href="#x402" className="block text-slate-600 hover:text-slate-900">Протокол x402</a>
            <a href="#api" className="block text-slate-600 hover:text-slate-900">API reference</a>
            <a href="#live" className="block text-slate-600 hover:text-slate-900">Живой каталог</a>
          </nav>
        </aside>

        <main className="lg:col-span-3 space-y-14">
          <section id="introduction">
            <h1 className="text-3xl font-bold">Введение</h1>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Netthouse — платёжная инфраструктура для AI-агентов. Она даёт вам HTTP-native
              платежи (x402), реестр двойной записи и автоматический клиринг встречных денежных
              потоков — чтобы агенты могли платить за ресурсы без счетов, сессий и ручных переводов.
            </p>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <b>Новое:</b> x402-платежи теперь работают. Ваши агенты могут платить за API-вызовы в USDC
                одним HTTP-заголовком — без аккаунтов, без регистрации, без KYC.
              </p>
            </div>
          </section>

          <section id="quickstart">
            <h2 className="text-2xl font-bold">Быстрый старт (3 шага)</h2>
            <p className="mt-4 text-slate-600">
              Заплатите за премиум API-вызов в 3 строки кода. Без создания аккаунта, без OAuth, без счетов.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">1. Установите SDK</h3>
                <Code lang="bash">{`npm install @netthouse/sdk`}</Code>
                <p className="mt-2 text-sm text-slate-500">
                  Или с GitHub: <code className="px-2 py-1 bg-slate-100 rounded text-xs">npm install github:netthouse/sdk-typescript</code>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">2. Создайте кошелёк</h3>
                <Code lang="typescript">{`import { generatePrivateKey } from "viem/accounts";
const privateKey = generatePrivateKey(); // 0x...`}</Code>
                <p className="mt-2 text-sm text-slate-500">
                  Пополните его USDC в сети Base (mainnet или тестовый Sepolia).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">3. Платите и получайте</h3>
                <Code lang="typescript">{`import { createX402Client } from "@netthouse/sdk";

const client = createX402Client({ privateKey });
const result = await client.fetch("${API}/premium/data");

if (result.response.ok) {
  const data = await result.response.json();
  console.log(data); // Premium market insights...
  console.log("Paid:", result.paid); // true
}`}</Code>
                <p className="mt-2 text-sm text-slate-500">
                  SDK автоматически обрабатывает 402 → подписывает EIP-3009 → повторяет запрос с X-PAYMENT.
                </p>
              </div>
            </div>
          </section>

          <section id="typescript">
            <h2 className="text-2xl font-bold">TypeScript SDK</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Полный пример: обнаружение доступных ресурсов, выбор одного, оплата и потребление.
            </p>

            <Code lang="typescript">{`import { createX402Client } from "@netthouse/sdk";

const API_URL = "https://api.netthouse.com";
const client = createX402Client({
  privateKey: process.env.BUYER_PRIVATE_KEY as \`0x\${string}\`,
});

// 1. Узнаём что доступно
const catalog = await client.discover(API_URL);
console.log("Найдено ресурсов:", catalog.length);
// → Найдено ресурсов: 1
// → • /premium/data — 0.10 USDC в сети base

// 2. Выбираем ресурс (первый с USDC в Base)
const target = catalog.find(i =>
  i.accepts.some(r => r.network === "base" && r.asset)
);
const url = \`\${API_URL}\${target.resource}\`;

// 3. Запрос с автоматической оплатой
const result = await client.fetch(url);

if (result.response.ok) {
  const data = await result.response.json();
  console.log("✓ Статус:", result.response.status);
  console.log("✓ Оплачено:", result.paid);
  console.log("✓ Данные:", data);
  // → { data: "Premium market insights...", txHash: "0x..." }
}`}</Code>

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">API Reference</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><code className="px-2 py-1 bg-white rounded text-xs">client.discover(baseUrl)</code> → <code>DiscoveredResource[]</code></li>
                <li><code className="px-2 py-1 bg-white rounded text-xs">client.fetch(url, init?)</code> → <code>{`{ response: Response, paid: boolean, paymentHeader?: string }`}</code></li>
                <li><code className="px-2 py-1 bg-white rounded text-xs">client.address</code> → <code>0x{`{string}`}</code></li>
              </ul>
            </div>
          </section>

          <section id="python">
            <h2 className="text-2xl font-bold">Python</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Официального Python SDK ещё нет, но x402 работает через HTTP. Вот как сделать это через <code>requests</code> и <code>web3.py</code>:
            </p>

            <Code lang="python">{`import requests
from web3 import Web3
from eth_account import Account

# Настройка
API_URL = "https://api.netthouse.com"
PRIVATE_KEY = "0x..."  # Ваш кошелёк покупателя
w3 = Web3(Web3.HTTPProvider("https://sepolia.base.org"))
account = Account.from_key(PRIVATE_KEY)

# 1. Первый запрос → получаем 402 с требованиями
resp = requests.get(f"{API_URL}/premium/data")
assert resp.status_code == 402

requirements = resp.json()["requirements"]
# → { scheme: "exact", network: "base", payTo: "0x...", maxAmountRequired: "100000", ... }

# 2. Подписываем авторизацию EIP-3009 (офф-чейн подпись для перевода USDC)
# Это сложная часть — используйте x402-python SDK когда он появится
# А пока используйте TypeScript SDK или прямое подписание через web3.py

# 3. Повторяем запрос с заголовком X-PAYMENT
payment_header = "<signed_payload>"  # Из шага 2
resp = requests.get(
    f"{API_URL}/premium/data",
    headers={"X-PAYMENT": payment_header}
)

if resp.status_code == 200:
    data = resp.json()
    print("✓ Оплачено и получено:", data)
    # → { data: "Premium market insights...", txHash: "0x..." }`}</Code>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <b>Примечание:</b> Подписание EIP-3009 нетривиально. Мы разрабатываем официальный Python SDK.
                А пока используйте TypeScript SDK или смотрите <a href="#curl" className="underline">пример с curl</a> для сырого протокола.
              </p>
            </div>
          </section>

          <section id="curl">
            <h2 className="text-2xl font-bold">curl (под капотом)</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Посмотрите как работает x402 на уровне HTTP. Четыре запроса, один платёж.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">1. Обнаружение доступных ресурсов</h3>
                <Code>{`curl ${API}/discover

# Ответ:
{
  "x402Version": 1,
  "items": [
    {
      "resource": "/premium/data",
      "type": "http",
      "accepts": [
        {
          "scheme": "exact",
          "network": "base",
          "payTo": "0x9CeceD626E30b60AaFDe7DFa65b6B4BD4c674a64",
          "maxAmountRequired": "100000",
          "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        }
      ]
    }
  ]
}`}</Code>
              </div>

              <div>
                <h3 className="text-lg font-semibold">2. Запрос ресурса → получаем 402</h3>
                <Code>{`curl -i ${API}/premium/data

# Ответ:
HTTP/1.1 402 Payment Required
x-payment-requirements: {"scheme":"exact","network":"base",...}

{
  "error": "Payment required",
  "requirements": { ... }
}`}</Code>
              </div>

              <div>
                <h3 className="text-lg font-semibold">3. Подписываем EIP-3009 и собираем заголовок X-PAYMENT</h3>
                <Code>{`# Это сложная часть — используйте SDK или x402 библиотеку
# Заголовок содержит:
# - authorization: EIP-712 подписанная авторизация перевода
# - signature: ECDSA подпись от кошелька покупателя
# - network, scheme, payTo и т.д.

PAYMENT_HEADER="<base64-encoded-payment-payload>"`}</Code>
              </div>

              <div>
                <h3 className="text-lg font-semibold">4. Повторяем с X-PAYMENT → получаем 200</h3>
                <Code>{`curl -H "X-PAYMENT: $PAYMENT_HEADER" ${API}/premium/data

# Ответ:
HTTP/1.1 200 OK

{
  "data": "Premium market insights: AI agent payments grew 340% in 2026",
  "pricePaid": "0.10 USDC",
  "txHash": "0xad6259b0f3de40b2229bb313ff03d382271b08f7ffd0492fd82429c6675da67a",
  "network": "base",
  "paidAt": "2026-10-19T09:32:39.220Z"
}`}</Code>
                <p className="mt-2 text-sm text-slate-500">
                  Проверьте транзакцию: <a href="https://basescan.org/tx/0xad6259b0f3de40b2229bb313ff03d382271b08f7ffd0492fd82429c6675da67a" className="text-blue-600 hover:underline" target="_blank">basescan.org/tx/0xad62...a67a</a>
                </p>
              </div>
            </div>
          </section>

          <section id="x402">
            <h2 className="text-2xl font-bold">Протокол x402</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              x402 превращает HTTP 402 «Payment Required» в машиночитаемый платёжный протокол. Поток:
            </p>
            <ol className="mt-4 list-decimal list-inside space-y-2 text-slate-600">
              <li><b>Обнаружение:</b> Агент вызывает <code>GET /discover</code> чтобы увидеть доступные ресурсы и цены.</li>
              <li><b>Запрос:</b> Агент вызывает платный ресурс → сервер отвечает <b>402</b> с требованиями (сумма, валюта, получатель).</li>
              <li><b>Подпись:</b> Агент подписывает авторизацию EIP-3009 (офф-чейн разрешение на перевод USDC).</li>
              <li><b>Оплата:</b> Агент повторяет запрос с заголовком <b>X-PAYMENT</b>, несущим подписанный payload.</li>
              <li><b>Проверка:</b> Сервер проверяет подпись через фасилитатор (x402.org).</li>
              <li><b>Расчёт:</b> Фасилитатор отправляет он-чейн транзакцию (без газа для продавца).</li>
              <li><b>Отдача:</b> Сервер возвращает ресурс + txHash.</li>
            </ol>

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Почему x402?</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>✓ <b>Без аккаунтов:</b> Агент платит кошельком, а не логином/паролем.</li>
                <li>✓ <b>Без регистрации:</b> Никаких API-ключей, OAuth, онбординга.</li>
                <li>✓ <b>Один round-trip:</b> Оплата происходит в повторной попытке, а не отдельным API-вызовом.</li>
                <li>✓ <b>Без газа для продавца:</b> Фасилитатор платит газ, продавец получает USDC напрямую.</li>
              </ul>
            </div>
          </section>

          <section id="api">
            <h2 className="text-2xl font-bold">API reference</h2>
            <div className="mt-6 overflow-hidden border border-slate-200 rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Метод</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Путь</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Описание</th>
                    <th className="px-4 py-2 text-left font-medium text-slate-500">Авторизация</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <Row m="GET" p="/discover" d="Список платных ресурсов с ценами" a="Public" />
                  <Row m="GET" p="/premium/data" d="Премиум данные (0.10 USDC)" a="x402" />
                  <Row m="GET" p="/payments" d="Список x402-платежей" a="Admin" />
                  <Row m="GET" p="/health" d="Проверка здоровья API" a="Public" />
                  <Row m="POST" p="/organizations" d="Создать организацию" a="API key" />
                  <Row m="GET" p="/organizations" d="Список организаций" a="API key" />
                  <Row m="POST" p="/accounts" d="Создать счёт" a="API key" />
                  <Row m="GET" p="/accounts" d="Список счетов" a="API key" />
                  <Row m="POST" p="/transactions" d="Отправить сбалансированную транзакцию" a="API key" />
                  <Row m="GET" p="/transactions" d="Список транзакций" a="API key" />
                  <Row m="GET" p="/clearing" d="Предложение клиринга" a="API key" />
                  <Row m="POST" p="/clearing/apply" d="Применить неттинг" a="API key" />
                  <Row m="POST" p="/api-keys" d="Выпустить API-ключ" a="Admin" />
                  <Row m="GET" p="/api-keys" d="Список API-ключей" a="Admin" />
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              <b>Способы авторизации:</b> <code>Public</code> (без авторизации), <code>x402</code> (заголовок X-PAYMENT), <code>API key</code> (Authorization: Bearer), <code>Admin</code> (админский API-ключ).
            </p>
          </section>

          <section id="live">
            <h2 className="text-2xl font-bold">Живой каталог</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Посмотрите что доступно прямо сейчас на production API:
            </p>
            <Code>{`curl ${API}/discover | jq`}</Code>
            <p className="mt-4 text-slate-600">
              Или попробуйте сами: заплатите 0.10 USDC за премиум данные и увидьте транзакцию на <a href="https://basescan.org" className="text-blue-600 hover:underline" target="_blank">basescan.org</a>.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Сеть</h4>
                <p className="text-sm text-slate-600">Base (mainnet) / Base Sepolia (testnet)</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Валюта</h4>
                <p className="text-sm text-slate-600">USDC (0x8335...2913 на mainnet)</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Пример цены</h4>
                <p className="text-sm text-slate-600">0.10 USDC за API-вызов</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Расчёт</h4>
                <p className="text-sm text-slate-600">~3 секунды (время блока Base)</p>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-slate-200">
            <div className="p-6 bg-slate-900 text-white rounded-lg">
              <h3 className="text-xl font-bold mb-2">Готовы создавать?</h3>
              <p className="text-slate-300 mb-4">
                Создайте организацию, выпустите API-ключ и начните принимать x402-платежи от AI-агентов.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://app.netthouse.com"
                  className="px-6 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100"
                >
                  Открыть дашборд →
                </a>
                <a
                  href="https://github.com/netthouse"
                  className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 border border-slate-700"
                  target="_blank"
                >
                  GitHub →
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Row({ m, p, d, a }: { m: string; p: string; d: string; a: string }) {
  const authColor =
    a === "Public" ? "bg-green-100 text-green-700" :
    a === "x402" ? "bg-blue-100 text-blue-700" :
    a === "API key" ? "bg-slate-100 text-slate-700" :
    "bg-amber-100 text-amber-700";

  return (
    <tr>
      <td className="px-4 py-2 font-mono text-xs font-semibold text-slate-900">{m}</td>
      <td className="px-4 py-2 font-mono text-xs text-slate-600">{p}</td>
      <td className="px-4 py-2 text-slate-600">{d}</td>
      <td className="px-4 py-2">
        <span className={`px-2 py-1 rounded text-xs font-medium ${authColor}`}>
          {a}
        </span>
      </td>
    </tr>
  );
}