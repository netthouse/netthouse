cd /d D:\netthouse && powershell -Command "Set-Content -Path 'STRATEGY.md' -Encoding UTF8 -Value @'
# Netthouse — Стратегический план 2026

> Документ создан: 21.10.2026
> Последнее обновление: 07.11.2026
> Статус: MVP-ready, production запущен, маркетинг стартовал

---

## 1. Текущее состояние (на 07.11.2026)

### Готово (98%)

**Инфраструктура:**
- ✅ x402 протокол: HTTP 402 → EIP-3009 → USDC на Base mainnet
- ✅ Production API: https://api.netthouse.com (Verified SSL, custom domain)
- ✅ Production Web: https://app.netthouse.com (i18n RU+EN, Stripe Checkout)
- ✅ Marketing Site: https://netthouse.com + https://www.netthouse.com
- ✅ БД: PostgreSQL Neon (облако)
- ✅ CI: GitHub Actions зелёный, автодеплой на Render
- ✅ Auth: Clerk (promoted-ghost-5475.accounts.dev)

**Продукт:**
- ✅ Dashboard: организации, счета, транзакции, API ключи, клиринг, платежи, комиссия, биллинг
- ✅ Каталог /discover: 4 платных ресурса (premium/data, market-data, agent-news, fx-rates)
- ✅ Цены: $0.05-$0.25 USDC за запрос
- ✅ TypeScript SDK: @netthouse/sdk (npm 0.1.3, опубликован)
- ✅ Python SDK: `pip install netthouse` (PyPI, v0.1.0, первая оплата tx 0xf9f758...)
- ✅ Демо-агент: полный цикл discover → pay → consume
- ✅ Тесты: 8 passing (vitest)

**Собственный facilitator (ЗАКРЫТО):**
- ✅ Модуль `src/facilitator/index.ts` (viem + x402/facilitator)
- ✅ Поддержка Base mainnet и Base Sepolia через `X402_NETWORK`
- ✅ Mainnet smoke-тест пройден: tx `0xc177acae1afc9e6eee5bc1ab92c55d65e33b3b631ad8d83b03dfe3c5ddd659a1` (0.05 USDC, комиссия 5%)

**Монетизация (полный цикл замкнут):**
- ✅ 3 тарифа: Free $0 (10%), Pro $29/мес (5%), Enterprise $299/мес (2%)
- ✅ Stripe Checkout + подписки (test mode)
- ✅ Webhook обновляет тариф в БД (invoice.paid → 200 OK, Delivered)
- ✅ Middleware x402 читает тариф → комиссия динамическая
- ✅ Страница /billing с переключателем языков (RU+EN)
- ✅ Доказательство: транзакция с комиссией 5% вместо 10% для Pro

**Рычаг отключения:**
- ✅ `is_suspended` у организации → 403 на платежи + скрытие из /discover
- ✅ Скрипт `packages/db/src/check-suspensions.ts` готов (ждёт cron)

**Маркетинг (опубликовано):**
- ✅ `marketing/hn-show.md` (Show HN черновик готов, ждёт кармы)
- ✅ `marketing/twitter-launch.md` (Twitter тред черновик готов)
- ✅ `marketing/devto-article.md` (статья на dev.to)
- ✅ dev.to статья: https://dev.to/zhasulan391/how-we-built-x402-payments-for-ai-agents-on-base-mainnet-1ado
- ✅ Twitter/X @netthouse: launch-тред из 4 твитов
- ✅ Reddit r/Base: https://www.reddit.com/r/BASE/comments/1xq55h4/built_opensource_payment_infrastructure_for_ai/
- ✅ Reddit r/ethdev: https://www.reddit.com/r/ethdev/comments/1xq4ml0/we_built_opensource_x402_payment_infrastructure/

### Осталось (2%)

- [ ] Stripe live mode + реквизиты ИП Казахстан (валюта USDT→USDC)
- [ ] Cron авто-суспенда на Render (`check-suspensions`)
- [ ] Больше ресурсов в каталоге (сейчас 4, цель 10+)
- [ ] Мониторинг (Sentry, logging)
- [ ] Аналитика (сколько платежей, какие агенты)
- [ ] DMARC запись в Cloudflare (опционально)
- [ ] Русская версия лендинга netthouse.com (сейчас только EN)
- [ ] Собственная система входа (заменить Clerk на NextAuth.js или кастомный UI)
- [ ] Увеличить скорость загрузки (убрать cold start Render free → VPS или Render paid)
- [ ] Маркетинг: Hacker News Show HN (нужна карма, ~1 неделя)
- [ ] Маркетинг: Product Hunt (после первых откликов)
- [ ] Мониторинг откликов на dev.to / Twitter / Reddit

---

## 2. Юрлицо и налоги

**Есть:** ИП + ТОО в Казахстане.

### Для Stripe рекомендуется ИП на УСН (упрощёнке):
- 3% с дохода (вместо 19% на ОУП)
- Лимит ~38 млн ₸/год (~$75K)
- Нужен валютный расчётный счёт (Kaspi/Halyk/Jusan с SWIFT)
- Переключение Stripe в Live mode + банковские реквизиты

### Когда обороты > $75K/год:
- Переход на ТОО (ограниченная ответственность важнее экономии)
- 20% КПН + 5% ИПН на дивиденды ≈ 24%

---

## 3. План на 3 месяца

### Месяц 1: Запуск и первые пользователи
1. ~~Закрыть Stripe webhook на production~~ ✅ (07.11.2026)
2. Переключить Stripe в live mode + подключить реквизиты ИП
3. Настроить cron для check-suspensions
4. ~~Опубликовать SDK на npm~~ ✅ (@netthouse/sdk 0.1.3)
5. ~~GitHub open-source (SDK + demo-agent): README, LICENSE, Contributing~~ ✅
6. ~~Запустить Twitter/X~~ ✅ + Discord (в процессе)
7. Пост на Hacker News (Show HN) — ждёт кармы
8. dev.to + Reddit публикации ✅
9. **Цель: 50 первых пользователей, 100 платежей**

### Месяц 2: Growth и фидбек
1. Добавить 3-5 новых ресурсов в каталог
2. Dashboard для продавцов (статистика доходов)
3. Партнёрства с AI-платформами (LangChain, AutoGPT, MCP community)
4. Аналитика платежей
5. **Цель: 500 пользователей, 1000 платежей**

### Месяц 3: Токен и масштабирование
1. Whitepaper про токен NETT
2. Смарт-контракт + аудит
3. Airdrop для ранних пользователей
4. Листинг на DEX (Uniswap на Base)
5. Fundraising раунд ($500k-1M)
6. **Цель: 5000 пользователей, 10k платежей**

---

## 4. Каналы рекламы

### Приоритет 1 (сразу)
- **GitHub**: open-source SDK, README с примерами, badges (build, npm version) ✅
- **Twitter/X**: @netthouse, треды про x402/AI agents, демо-видео «агент платит за 3 секунды» ✅
- **Discord**: сервер для разработчиков (#general, #dev-help, #showcase, #announcements)

### Приоритет 2 (после 100 пользователей)
- Reddit: r/CryptoCurrency, r/ethereum, r/Base ✅ (r/Base + r/ethdev опубликовано)
- Base official Discord — featured project
- Product Hunt (launch day)
- Hacker News (Show HN)

### Приоритет 3 (после 500 пользователей)
- Конференции: ETH Denver, ETH CC, AI Engineer Summit, NeurIPS
- Питч-конкурсы для стартапов
- Партнёрства с AI-инфлюенсерами

---

## 5. Utility Token NETT

### Концепция
- Токен для оплаты API-вызовов внутри платформы
- Агенты покупают NETT за USDC и тратят на запросы
- Скидка 10% при оплате в NETT (против USDC) — стимул держателей
- НЕ security: нет дивидендов, нет доли в компании, только утилити

### Почему utility, а не security
- Реальная утилити (оплата API) → ниже риск признания ценной бумагой
- Ценность растёт от использования платформы, а не от обещаний прибыли
- Проще листинг на DEX без регуляторных барьеров

### Tokenomics (черновик)
- Total supply: 1,000,000,000 NETT
- Распределение:
  - 40% — экосистема и airdrop (вестинг 4 года)
  - 20% — команда (вестинг 4 года, cliff 1 год)
  - 15% — инвесторы (вестинг 2 года)
  - 15% — treasury / DAO
  - 10% — ликвидность (DEX)
- Дефляция: 1% от каждого платежа сжигается

### Техническая реализация
1. ERC-20 на Base (контракт ~1 неделя)
2. Аудит: CertiK / OpenZeppelin ($10-20k, 2-4 недели)
3. Интеграция с x402: NETT как второй asset в payment requirements
4. DEX-листинг: Uniswap v3 на Base (ликвидность $50-100k)
5. CEX-листинг: через 6-12 месяцев после объёмов (MEXC, Gate.io первыми)

### Юридические аспекты
- Компания в crypto-friendly юрисдикции (Сингапур, Швейцария, ОАЭ, BVI)
- Legal opinion: токен ≠ security (меморандум юрфирмы, $5-15k)
- KYC/AML для инвесторов в раунде fundraising
- MiCA compliance для рынка ЕС

### Таймлайн токена
- Месяц 3: whitepaper + legal opinion
- Месяц 4: смарт-контракт + аудит
- Месяц 5: airdrop + DEX-листинг
- Месяц 6+: CEX, партнёрства, market maker

### Риски и митигация
- SEC/регуляторы → legal opinion + чистая utility-модель
- Низкая ликвидность → старт с DEX, market maker позже
- Конкуренты → скорость и фокус на AI agents (никто не делает x402+clearing)

---

## 6. Оценка готовности проекта

**Вердикт: MVP-ready, production запущен, маркетинг стартовал.**

Можно запускать и привлекать первых пользователей прямо сейчас.

«100% готовности» не существует: запуск → фидбек → итерации.

Идеальный продукт — враг запущенного продукта.

---

## 7. Ключевые артефакты

- Продавец (mainnet): `0x9CeceD626E30b60AaFDe7DFa65b6B4BD4c674a64`
- Fee address (Netthouse): `0x695B93A45e996A6bc8fee792503ee49c9a89B23d`
- USDC Base mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- USDC Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- API: https://api.netthouse.com
- Web: https://app.netthouse.com
- Site: https://netthouse.com
- Доказательство монетизации: tx `0xc177acae1afc9e6eee5bc1ab92c55d65e33b3b631ad8d83b03dfe3c5ddd659a1` (комиссия 5% для Pro)

---

*Документ обновлён: 07.11.2026. Обновлять по мере закрытия задач.*
'@"