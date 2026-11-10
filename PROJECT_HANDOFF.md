# PROJECT HANDOFF — Netthouse


Техническая документация для передачи проекта AI-разработчику.


Последнее обновление: 10 ноября 2026.

---

## 1. Назначение проекта

### Какую проблему решает

Netthouse — это платёжная инфраструктура для AI-агентов. Современные автономные агенты (LLM-based, MCP-серверы, tool-calling агенты) должны платить за внешние ресурсы (API, данные, вычисления), но классические платёжные системы требуют регистрации, счетов, KYC и ручных переводов. Это несовместимо с природой агентов.

### Кто пользователи

1. Разработчики AI-агентов — хотят чтобы их агенты платили за API в один HTTP-запрос.

2. Провайдеры MCP-серверов и API — хотят монетизировать свои сервисы через x402.

3. Команды с множеством агентов — нуждаются в атрибуции затрат по агентам/проектам.

4. Маркетплейсы агент-агент — хотят двусторонние платежи между агентами с автоматическим клирингом.

### Что уже реализовано

- Маркетинговый сайт (netthouse.com) — лендинг + документация на EN/RU.

- Dashboard (app.netthouse.com) — управление организациями, счетами, транзакциями, API-ключами, клирингом.

- REST API (api.netthouse.com) — endpoints для организаций, счетов, транзакций, x402-платежей.

- TypeScript SDK (@netthouse/sdk) — обёртка над x402 для клиентов.

- x402 facilitator — приём HTTP-native платежей в USDC на Base.

- Двойная бухгалтерия — каждая транзакция сбалансирована, нет создания/уничтожения денег.

- Автоматический клиринг — встречные потоки между счетами сводятся.

- Мультивалютность — USD, EUR, токены (USDC).

- Гранулярные API-ключи — admin / write / read / transact.

- Clerk-авторизация — с брендированными страницами входа.

### Что в разработке

- Интеграция Lemon Squeezy (выбор сделан 9.11.2026) — приём fiat-платежей за подписки (Pro $29, Enterprise $299) и выплат в Казахстан.

- Python SDK для x402.

- On-premise Enterprise версия.

- Собственная авторизация (NextAuth) — планируется после стабилизации платформы.

---

## 2. Структура monorepo

netthouse/

├── apps/

│ ├── site/ # Маркетинговый сайт (netthouse.com)

│ ├── web/ # Dashboard (app.netthouse.com)

│ └── api/ # REST API (api.netthouse.com)

├── packages/

│ ├── sdk-typescript/ # TypeScript SDK (@netthouse/sdk)

│ ├── shared/ # Общие утилиты и типы

│ ├── db/ # Drizzle schema + database client

│ └── x402/ # Внутренний x402 facilitator

├── docs/ # Внутренняя документация (ADR, планы)

├── pnpm-workspace.yaml # Конфиг pnpm workspaces

├── turbo.json # Turborepo конфигурация

├── package.json # Корневые скрипты

└── PROJECT_HANDOFF.md # Этот файл

### Что деплоится отдельно

| Сервис | Домен | Тип | Примечания |

|--------|-------|-----|------------|

| apps/site | netthouse.com | Next.js static/dynamic | Render, Cloudflare |

| apps/web | app.netthouse.com | Next.js dynamic | Render, Clerk |

| apps/api | api.netthouse.com | Node.js API | Render |

### Где что находится

- Сайт: apps/site/src/app/page.tsx (EN), apps/site/src/app/ru/page.tsx (RU).

- Dashboard: apps/web/src/app/ — все страницы dashboard.

- API: apps/api/src/routes/ — REST endpoints.

- БД: packages/db/src/schema.ts — схема, packages/db/drizzle/ — миграции.

- SDK: packages/sdk/src/ — исходники TypeScript SDK.

---

## 3. Локальный запуск

### Требования

- Node.js: ≥ 20.x (рекомендуется 20.18+)

- pnpm: ≥ 9.x

- Docker: опционально для Postgres (можно использовать Supabase/Turso локально)

- Git: для работы с monorepo

### Установка зависимостей

Bash



pnpm install



\# Маркетинговый сайт (порт 3002)

cd apps/site \&\& pnpm dev



\# Dashboard (порт 3000)

cd apps/web \&\& pnpm dev



\# API (порт 3001)

cd apps/api \&\& pnpm dev



\# Typecheck всего monorepo

pnpm --filter @netthouse/site typecheck

pnpm --filter @netthouse/web typecheck

pnpm --filter @netthouse/api typecheck



\# Lint

pnpm --filter @netthouse/site lint

pnpm --filter @netthouse/web lint



\# Production build

pnpm --filter @netthouse/site build

pnpm --filter @netthouse/web build

pnpm --filter @netthouse/api build



\# Тесты

pnpm --filter @netthouse/site test

pnpm --filter @netthouse/web test

pnpm --filter @netthouse/api test



4\. Архитектура

Frontend

Next.js 16.3.5 с App Router и Turbopack.

Tailwind CSS для стилей (slate палитра как основа).

Clerk для клиентской авторизации в dashboard.

shadcn/ui для UI-компонентов.



Backend

Express / Fastify (уточнить в apps/api/package.json).

REST API + webhook endpoints для Lemon Squeezy и Clerk.

x402 facilitator как отдельный сервис внутри API.



База данных

PostgreSQL (Supabase или Neon на проде).

Drizzle ORM — packages/db/src/schema.ts.

Миграции через Drizzle Kit.



Авторизация

Clerk — пользовательские сессии, 2FA, OAuth.

API keys — для агентов и внешних интеграций.

Гранулярные права: admin, write, read, transact.

Webhook-проверка подписей Clerk.

Платежи (Fiat)

Lemon Squeezy — подписки (Pro $29, Enterprise $299), выплаты в Казахстан.

Webhooks: order\_created, subscription\_created, subscription\_updated.

Stripe — был ранее, миграция на Lemon Squeezy в процессе.



Платежи (Crypto / x402)

x402 protocol — HTTP-native платежи (RFC draft).

Base mainnet — production (chain ID 8453).

Base Sepolia — testnet (chain ID 84532).

USDC — платёжный токен (mainnet: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913).

EIP-3009 — off-chain подпись разрешения на перевод USDC.

Facilitator (x402.org) — проверка подписей и on-chain settlement.

Внешние API

Basescan — просмотр транзакций.

Base RPC — https://sepolia.base.org (testnet), https://mainnet.base.org (mainnet).

Render — деплой всех сервисов.

Cloudflare — CDN, DNS, защита для netthouse.com.



Схема обмена данными

AI Agent ──(x402/USDC)──> Netthouse API ──(Facilitator)──> Base (USDC transfer)

&#x20;                              │

&#x20;                              ├──> Postgres (ledger, payments)

&#x20;                              │

Dashboard ──(Clerk JWT)──> Netthouse API ──> Postgres

&#x20;                              │

&#x20;                              └──(Lemon Squeezy webhook)──> Subscription updates



5\. Маршруты и страницы

Сайт (netthouse.com)

/

apps/site/src/app/page.tsx

Главная EN

/docs

apps/site/src/app/docs/page.tsx

Документация EN

/ru

apps/site/src/app/ru/page.tsx

Главная RU

/ru/docs

apps/site/src/app/ru/docs/page.tsx

Документация RU



Dashboard (app.netthouse.com)

Маршрут

Файл

Описание

/sign-in

apps/web/src/app/sign-in/\[sign-in]/page.tsx

Вход

/sign-up

apps/web/src/app/sign-up/\[sign-up]/page.tsx

Регистрация

/

apps/web/src/app/page.tsx

Редирект на /organizations

/organizations

apps/web/src/app/organizations/

Список организаций

/accounts

apps/web/src/app/accounts/

Счета организации

/transactions

apps/web/src/app/transactions/

Транзакции

/payments

apps/web/src/app/payments/

x402 платежи

/billing

apps/web/src/app/billing/

Подписки Lemon Squeezy

/api-keys

apps/web/src/app/api-keys/

API-ключи

/clearing

apps/web/src/app/clearing/

Клиринг

/commission

apps/web/src/app/commission/

Комиссии



API (api.netthouse.com)

Метод

Путь

Auth

Описание

GET

/discover

Public

Список x402-ресурсов

GET

/premium/data

x402

Премиум данные (0.10 USDC)

GET

/health

Public

Health check

GET

/payments

Admin

Список x402 платежей

POST

/organizations

API key

Создать организацию

GET

/organizations

API key

Список организаций

POST

/accounts

API key

Создать счёт

GET

/accounts

API key

Список счетов

POST

/transactions

API key

Сбалансированная транзакция

GET

/transactions

API key

Список транзакций

GET

/clearing

API key

Предложение клиринга

POST

/clearing/apply

API key

Применить неттинг

POST

/api-keys

Admin

Выпустить API-ключ

GET

/api-keys

Admin

Список API-ключей



6\. Правила изменения сайта

Где менять

Страница

Файл

EN главная

apps/site/src/app/page.tsx

RU главная

apps/site/src/app/ru/page.tsx

EN документация

apps/site/src/app/docs/page.tsx

RU документация

apps/site/src/app/ru/docs/page.tsx



Как добавлять новый язык

Создать папку apps/site/src/app/{lang}/ (например de/).

Скопировать page.tsx и docs/page.tsx.

Перевести контент.

Добавить переключатель во все языковые версии.

Добавить export const dynamic = "force-dynamic" и export const revalidate = 0.

Проверить next.config.ts на headers для нового языка.

Metadata, revalidate, dynamic и кеширование



export const dynamic = "force-dynamic";      // Принудительно динамический рендер

export const revalidate = 0;                  // Не использовать ISR кеш

export const metadata = { title: "...", description: "..." };



ВАЖНО: для всех не-английских маршрутов (/ru, /ru/docs) обязательны dynamic = "force-dynamic" и revalidate = 0. Это защита от бага Render, который ранее отдавал старую версию страницы из Full Route Cache.

Правила ссылок

В EN-файлах (page.tsx, docs/page.tsx): ссылки /docs, /ru в переключателе.

В RU-файлах (ru/page.tsx, ru/docs/page.tsx): ссылки /ru/docs, / в переключателе.

⚠️ Критическое правило для Windows

Всё, что содержит кириллицу, править ТОЛЬКО через Notepad (или VSCode с кодировкой UTF-8). PowerShell 5.1 и cmd ломают кириллицу при записи. Never use PowerShell Here-Strings с кириллицей.



7\. Деплой

Настройки Render

Сервис

Root Directory

Build Command

Start Command

Branch

site

/

pnpm install --frozen-lockfile \&\& pnpm --filter @netthouse/site build

pnpm --filter @netthouse/site start

main

web

/

pnpm install --frozen-lockfile \&\& pnpm --filter @netthouse/web build

pnpm --filter @netthouse/web start

main

api

/

pnpm install --frozen-lockfile \&\& pnpm --filter @netthouse/api build

pnpm --filter @netthouse/api start

main

Если Root Directory = apps/site, тогда:

Build: pnpm install --frozen-lockfile \&\& pnpm build

Start: pnpm start

Домены и Cloudflare

Сервис

Поддомен

Cloudflare Proxy

site

netthouse.com, www.netthouse.com

✅ Proxied

web

app.netthouse.com

✅ Proxied

api

api.netthouse.com

✅ Proxied



Порядок проверки после deploy

Дождаться статуса Live на Render (2-3 мин).

Проверить в инкогнито (обход браузерного кеша):

https://netthouse.com — EN главная

https://netthouse.com/ru — RU главная

https://netthouse.com/ru/docs — RU документация

https://app.netthouse.com — страница входа

https://api.netthouse.com/health — 200 OK

Проверить заголовки через curl -I https://netthouse.com/ru:

Должно быть: Cache-Control: private, no-store, ...

НЕ должно быть: s-maxage=31536000, x-nextjs-cache: HIT.



8\. Переменные окружения

НИКОГДА не коммитить реальные значения! Только названия.

Общие (все сервисы)

Переменная

Обязательна

Пример

NODE\_ENV

да

production

DATABASE\_URL

да

postgres://user:pass@host/db

REDIS\_URL

нет

redis://...

Dashboard (apps/web)

Переменная

Обязательна

Пример

NEXT\_PUBLIC\_CLERK\_PUBLISHABLE\_KEY

да

pk\_test\_...

CLERK\_SECRET\_KEY

да

sk\_test\_...

NEXT\_PUBLIC\_CLERK\_SIGN\_IN\_URL

да

/sign-in

NEXT\_PUBLIC\_CLERK\_SIGN\_UP\_URL

да

/sign-up

NEXT\_PUBLIC\_CLERK\_AFTER\_SIGN\_IN\_URL

да

/organizations

NEXT\_PUBLIC\_API\_URL

да

https://api.netthouse.com

WEBHOOK\_SECRET\_CLERK

да

whsec\_...



API (apps/api)

Переменная

Обязательна

Пример

BASE\_RPC\_URL

да

https://mainnet.base.org

BASE\_NETWORK

да

base или base-sepolia

USDC\_CONTRACT\_ADDRESS

да

0x833589fCD6...

FACILITATOR\_PRIVATE\_KEY

да

0x...

LEMON\_SQUEEZY\_API\_KEY

да

eyJ...

LEMON\_SQUEEZY\_STORE\_ID

да

12345

LEMON\_SQUEEZY\_WEBHOOK\_SECRET

да

...

JWT\_SECRET

да

(long random string)

RATE\_LIMIT\_REDIS\_URL

нет

redis://...



Site (apps/site)

Переменная

Обязательна

Пример

NEXT\_PUBLIC\_GA\_ID

нет

G-XXXXXXXXXX

9\. База данных

Основные таблицы



model Organization {

&#x20; id            String    @id @default(uuid())

&#x20; clerkUserId   String    @unique

&#x20; name          String

&#x20; plan          String    @default("free")  // free, pro, enterprise

&#x20; createdAt     DateTime  @default(now())

&#x20; accounts      Account\[]

&#x20; apiKeys       ApiKey\[]

&#x20; transactions  Transaction\[]

}



model Account {

&#x20; id            String         @id @default(uuid())

&#x20; organizationId String

&#x20; organization   Organization  @relation(fields: \[organizationId], references: \[id])

&#x20; currency      String         // USD, EUR, USDC

&#x20; balance       Decimal

&#x20; createdAt     DateTime       @default(now())

&#x20; transactions  TransactionEntry\[]

}



model Transaction {

&#x20; id            String              @id @default(uuid())

&#x20; organizationId String

&#x20; organization   Organization       @relation(fields: \[organizationId], references: \[id])

&#x20; description   String

&#x20; createdAt     DateTime            @default(now())

&#x20; entries       TransactionEntry\[]

}



model TransactionEntry {

&#x20; id             String       @id @default(uuid())

&#x20; transactionId  String

&#x20; transaction    Transaction  @relation(fields: \[transactionId], references: \[id])

&#x20; accountId      String

&#x20; account        Account      @relation(fields: \[accountId], references: \[id])

&#x20; amount         Decimal      // positive = debit, negative = credit

}



model ApiKey {

&#x20; id              String       @id @default(uuid())

&#x20; organizationId  String

&#x20; organization    Organization @relation(fields: \[organizationId], references: \[id])

&#x20; keyHash         String       @unique

&#x20; permissions     String\[]     // admin, write, read, transact

&#x20; revokedAt       DateTime?

&#x20; createdAt       DateTime     @default(now())

}



model Payment {

&#x20; id              String    @id @default(uuid())

&#x20; txHash          String    @unique

&#x20; resource        String

&#x20; amount          Decimal

&#x20; network         String

&#x20; createdAt       DateTime  @default(now())

}



Команды миграций



\# Создать миграцию после изменения src/schema.ts

cd packages/db

pnpm drizzle-kit generate



\# Применить миграции на проде

pnpm drizzle-kit migrate



\# Сгенерировать миграционные файлы (отдельный client не требуется)

Отдельная генерация клиента не требуется; Drizzle использует TypeScript-схему напрямую.



Правила изменения схемы

Сначала изменить packages/db/src/schema.ts.

Затем создать миграцию через `pnpm drizzle-kit generate`.

Никогда не удалять колонки без периода депрекации.

Всегда проверять обратную совместимость API.

Обязательно согласовать с владельцем продукта перед breaking changes.

Резервное копирование

Supabase/Neon делают автоматические бэкапы (уточнить у провайдера).

Для критических данных — ручной pg\_dump перед миграциями.

Команда восстановления: psql $DATABASE\_URL < backup.sql.



10\. Платёжная логика

x402 — HTTP-native платежи

Discover: GET /discover возвращает список платных ресурсов.

Request: клиент запрашивает ресурс → сервер отвечает 402 Payment Required с требованиями.

Sign: клиент подписывает EIP-3009 authorization (off-chain).

Pay: клиент повторяет запрос с заголовком X-PAYMENT.

Verify: сервер проверяет подпись через facilitator.

Settle: facilitator отправляет on-chain транзакцию (gasless для продавца).

Serve: сервер возвращает ресурс + txHash.

Кошельки

Buyer wallet: создаётся SDK'ом через generatePrivateKey() из viem.

Seller wallet: 0x9CeceD626E30b60AaFDe7DFa65b6B4BD4c674a64 (Netthouse receiver).

Facilitator wallet: FACILITATOR\_PRIVATE\_KEY в API.

Сеть

Production: Base mainnet (chain ID 8453).

Testnet: Base Sepolia (chain ID 84532).

RPC: https://mainnet.base.org, https://sepolia.base.org.

USDC-контракт

Base mainnet: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

Base Sepolia: (уточнить в документации Base)

Проверка платежа

Парсинг X-PAYMENT header.

Восстановление EIP-712 подписи.

Проверка payTo == наш адрес.

Проверка maxAmountRequired >= требуемой суммы.

Проверка network == Base.

Вызов facilitator (x402.org) для on-chain settlement.

Ожидание подтверждения транзакции (3 сек на Base).

Где хранятся payment records

Таблица Payment в Postgres.

Связь с txHash на Base.

Просмотр через Basescan: https://basescan.org/tx/{txHash}.

⚠️ Критические операции

БЕЗ ПОДТВЕРЖДЕНИЯ НЕЛЬЗЯ:

Менять FACILITATOR\_PRIVATE\_KEY.

Менять payTo адрес в коде.

Изменять USDC contract address.

Деплоить новые x402-ресурсы без проверки.

11\. Авторизация и безопасность

Clerk

Сессии: JWT + refresh tokens.

2FA: опционально, пользователь включает сам.

Webhooks: user.created, user.updated, session.created.

Брендированные страницы: clerk-theme.ts в apps/web/src/lib/.

Роли и права



admin

Полный доступ: API keys, billing, settings

write

Создание организаций, счетов, транзакций

read

Чтение всех данных

transact

Только проведение транзакций



API keys

Hashed через bcrypt или argon2 (уточнить в коде).

Хранятся в БД как keyHash, plaintext показывается один раз при создании.

Отзыв через revokedAt timestamp.

Webhook-проверки

Clerk: подпись через WEBHOOK\_SECRET\_CLERK (svix).

Lemon Squeezy: HMAC-SHA256 через LEMON\_SQUEEZY\_WEBHOOK\_SECRET.

Никогда не доверять webhook-данным без проверки подписи.

Rate limiting

Public endpoints: 100 req/min per IP.

Authenticated: 1000 req/min per user.

x402 endpoints: без rate limit (оплачивается).

Реализация: Redis + sliding window.

CORS

netthouse.com, app.netthouse.com, api.netthouse.com.

Для SDK — \* (публичный API).

⚠️ Важные меры

Никогда не логировать plaintext API keys.

Никогда не хранить plaintext пароли.

Все mutation-эндпоинты требуют аутентификации.

Все платежи проверяются на сервере (не доверять клиенту).

HTTPS-only на проде (HSTS включён через Cloudflare).

12\. Текущий статус

✅ Что работает

Маркетинговый сайт EN + RU.

Документация EN + RU.

Dashboard с авторизацией Clerk.

REST API.

x402 платежи (discover → pay → settle).

Двойная бухгалтерия.

Автоматический клиринг.

Гранулярные API keys.

Брендированные страницы входа.

🔧 В процессе

Интеграция Lemon Squeezy — выбран 9.11.2026. Открытие USD счёта в Шинхан банке 10.11.2026. Интеграция — следующая неделя.

❌ Что сломано

(Актуализировать при получении новых багов)

Known issues

Кеш Render — /ru может отдавать старую версию. Решение: dynamic = "force-dynamic" + revalidate = 0 + no-store headers.

Clerk localization — текущая версия @clerk/nextjs не поддерживает prop localization на компонентах SignIn/SignUp. Русский интерфейс через <html lang="ru"> + браузерную локализацию.

Приоритетные задачи

HIGH: Открыть USD счёт в Шинхан банке (10.11.2026).

HIGH: Регистрация Lemon Squeezy seller account (10.11.2026).

HIGH: Интеграция Lemon Squeezy webhook handler.

MEDIUM: Python SDK для x402.

LOW: NextAuth вместо Clerk (после стабилизации).

Недавние изменения (ноябрь 2026)

Добавлен RU лендинг и RU документация.

Тарифы синхронизированы между лендингом и billing: Free $0 (10%) / Pro $29 (5%) / Enterprise $299 (2%).

Убран устаревший тариф "Startup $99".

Добавлена защита от кеша для RU-маршрутов.

Страницы входа брендированы (логотип Netthouse, slate тема).

Решения, которые нельзя менять без согласования

Выбор Lemon Squeezy для fiat-платежей (альтернативы отклонены).

Выбор Base как основной сети (Ethereum mainnet — слишком дорого).

Выбор USDC как платёжного токена (ETH/DAI — не подходят).

Тарифная сетка: Free / Pro $29 / Enterprise $299 (соответствует billing).

13\. История важных решений

Почему Next.js App Router + Turbopack

SSR + SSG + API routes в одном фреймворке.

Monorepo-friendly.

Отличная DX и быстрый hot reload с Turbopack.

Почему Clerk

Готовые страницы входа/регистрации.

2FA, OAuth, webhooks из коробки.

Быстрая интеграция (< 1 дня).

Альтернативы: Auth.js, Supabase Auth, Firebase Auth — требуют больше настройки.

Почему x402

HTTP-native — идеально для агентов.

Без регистрации и API keys.

Один round-trip.

Альтернативы: Stripe (не для агентов), Lightning (сложность).

Почему Base

Дешёвый газ (< $0.01).

Быстрые блоки (2 сек).

Хорошая поддержка USDC.

Альтернативы: Polygon (медленнее), Arbitrum (дороже газ).

Почему Lemon Squeezy (решение 9.11.2026)

Плюсы: выплаты в Казахстан, 1 день на запуск, встроенный tax compliance.

Минусы: комиссия \~5% + $0.50.

Отклонённые:

Stripe Atlas: $500, 1-2 недели, US LLC, налоговая отчётность.

Только крипта: теряет карточных клиентов.

Почему revalidate = 0 + force-dynamic для RU

Render кешировал prerendered HTML и отдавал старую EN-версию.

Query-параметры обходили кеш.

Решение: принудительно динамический рендер.

Временные решения (технический долг)

Clerk localization: ждём обновления @clerk/nextjs для поддержки localization prop.

Python SDK: используется кастомная обёртка над web3.py, нет официального SDK.

Billing UI: некоторые элементы устарели после миграции Stripe → Lemon Squeezy (пока в процессе).

14\. Инструкции для AI-разработчика

Какие файлы можно менять

Любой код в apps/\*/src/.

Любой код в packages/\*/src/.

next.config.ts, turbo.json, package.json.

Drizzle schema (с осторожностью, см. раздел 9).

Какие файлы менять нельзя без согласования

pnpm-workspace.yaml (может сломать monorepo).

apps/api/src/middleware/auth.ts (критический для безопасности).

packages/db/src/schema.ts (только после согласования миграции).

Все файлы с приватными ключами (их вообще не должно быть в репо).

Обязательные проверки перед commit



\# 1. Typecheck

pnpm --filter @netthouse/site typecheck

pnpm --filter @netthouse/web typecheck

pnpm --filter @netthouse/api typecheck



\# 2. Lint

pnpm --filter @netthouse/site lint

pnpm --filter @netthouse/web lint



\# 3. Build

pnpm --filter @netthouse/site build

pnpm --filter @netthouse/web build



\# 4. Локально проверить страницы (если менялись)

cd apps/site \&\& pnpm dev

\# проверить http://localhost:3002/ru в инкогнито



Формат commit message

Conventional Commits:



<type>(<scope>): <description>



\[optional body]



\[optional footer(s)]



ипы: feat, fix, docs, style, refactor, perf, test, chore.

Scope: site, web, api, sdk, db.

Примеры:

feat(site): add Russian landing page

fix(api): handle x402 verification error

docs: update PROJECT\_HANDOFF.md

chore(web): upgrade Clerk to latest

Нужно ли спрашивать подтверждение

ДА, если:

Меняется схема БД.

Меняются тарифы (Free/Pro/Enterprise).

Меняются платёжные адреса (payTo, USDC contract).

Меняется логика x402 verification.

Добавляются новые переменные окружения.

Меняется deploy configuration.

НЕТ, если:

Мелкие баг-фиксы.

Копирайтинг на сайте.

Добавление тестов.

Обновление зависимостей (patch).

Как проверять production

Всегда в инкогнито.

Проверить все три домена: netthouse.com, app.netthouse.com, api.netthouse.com.

Проверить заголовки через curl -I (не должно быть s-maxage для RU).

Проверить RU-версию: /ru и /ru/docs.

Проверить переключатель EN/RU.

Как откатывать неудачный deploy

Зайти на Render → сервис → Deploys.

Найти предыдущий успешный деплой.

Нажать Manual Deploy → Deploy latest commit (если нужно перезапустить) или Rollback (если доступен).

Альтернативно: git revert <commit-hash> → push → новый деплой.

Если проблема в БД — восстановить из бэкапа (см. раздел 9).

Особенности Windows-разработки

Кириллица: только через Notepad или VSCode (UTF-8).

PowerShell: не использовать Here-Strings с кириллицей.

Cmd: Select-String не работает → использовать findstr.

curl: использовать curl.exe, не curl (алиас Invoke-WebRequest).

Абсолютные пути: D:\\netthouse\\apps\\site\\... безопаснее относительных.



15\. Список ближайших задач

\#

Задача

Приоритет

Статус

Связанные файлы

Критерий готовности

1

Открыть USD счёт в Шинхан банке

HIGH

TODO

—

Счёт активен, SWIFT получен

2

Регистрация Lemon Squeezy seller

HIGH

TODO

—

Аккаунт верифицирован, payout настроен

3

Интеграция Lemon Squeezy webhook handler

HIGH

TODO

apps/api/src/routes/webhooks/lemon.ts, apps/web/src/app/billing/

Pro/Enterprise подписки работают, webhook проверяется

4

Убрать старый Stripe-код

HIGH

TODO

apps/api/src/lib/stripe.ts, apps/web/src/app/billing/

Stripe-зависимости удалены, всё работает на Lemon Squeezy

5

Python SDK для x402

MEDIUM

TODO

packages/sdk-python/

pip install netthouse-x402, пример оплаты работает

6

Обновить Clerk до последней версии

MEDIUM

TODO

apps/web/package.json

localization prop работает, русский интерфейс

7

On-premise Enterprise

MEDIUM

TODO

packages/on-premise/

Docker compose для развёртывания у клиента

8

NextAuth вместо Clerk

LOW

BACKLOG

apps/web/src/lib/auth.ts

Миграция пользователей, 0 breaking changes

9

Маркетинг (после платформы)

LOW

BLOCKED

—

Открыть только после полной готовности платформы

Контакты и ресурсы

GitHub: github.com/netthouse/netthouse

SDK: github.com/netthouse/sdk-typescript

Render dashboard: dashboard.render.com

Cloudflare: dash.cloudflare.com

Lemon Squeezy: app.lemonsqueezy.com

Clerk: dashboard.clerk.com

Конец документа. Последнее обновление: 10 ноября 2026.



