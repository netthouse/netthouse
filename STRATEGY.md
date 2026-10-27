\# Netthouse — Стратегический план 2026



> Документ создан: 21.10.2026

> Статус: MVP-ready, mainnet-запуск в процессе



\---



\## 1. Текущее состояние (на 21.10.2026)



\### Готово (90%)

\- ✅ x402 протокол: HTTP 402 → EIP-3009 → USDC on Base

\- ✅ Публичный API: netthouse-api.onrender.com

\- ✅ TypeScript SDK: @netthouse/sdk (discover + fetch с автооплатой) 

\- ✅ Python SDK: `pip install netthouse` (готов, тестовая оплата 0.05 USDC на tx 0xf9f758...)

\- ✅ Демо-агент: полный цикл discover → pay → consume

\- ✅ Реальный txHash на Base Sepolia: 0xad6259b0f3de40b2229bb313ff03d382271b08f7ffd0492fd82429c6675da67a

\- ✅ Документация: netthouse.com/docs (Quick Start, TS/Python/curl, API ref)

\- ✅ Лендинг: netthouse.com

\- ✅ Dashboard: app.netthouse.com (payments, organizations, transactions, clearing)

\- ✅ i18n: EN + RU

\- ✅ Тесты: 8 passing (vitest)

\- ✅ Discovery: GET /discover (спека x402)

- ✅ Каталог: 4 платных ресурса (premium/data, market-data, agent-news, fx-rates)
- ✅ Цены: $0.05-$0.25 USDC за запрос

\- ✅ Прод-деплой: Neon (Postgres) + Render (API+web) + Cloudflare (DNS)



\### Осталось (10%)

- [x] Smoke-тест x402 через прод-API (Base Sepolia, tx 0xa31387a1...ac268)
- [ ] Mainnet: заблокирован публичным facilitator → нужен собственный (см. раздел 6)

\- \[ ] Публикация SDK на npm

\- \[ ] Больше ресурсов в каталоге (сейчас только /premium/data)

\- \[ ] README для GitHub SDK

\- \[ ] Мониторинг (Sentry, logging)

\- \[ ] Аналитика (сколько платежей, какие агенты)



\### Ключевые артефакты

\- Продавец (mainnet): 0x9CeceD626E30b60AaFDe7DFa65b6B4BD4c674a64

\- USDC Base mainnet: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

\- USDC Base Sepolia: 0x036CbD53842c5426634e7929541eC2318f3dCF7e

\- API: https://netthouse-api.onrender.com

\- Web: https://app.netthouse.com

\- Site: https://netthouse.com



\---



\## 2. План на 3 месяца



\### Месяц 1: Запуск и первые пользователи

1\. Закрыть Mainnet smoke-тест ($0.10)

2\. Опубликовать SDK на npm

3\. GitHub open-source (SDK + demo-agent): README, LICENSE, Contributing

4\. Запустить Twitter/X + Discord

5\. Пост на Hacker News (Show HN)

6\. \*\*Цель: 50 первых пользователей, 100 платежей\*\*



\### Месяц 2: Growth и фидбек

1\. Добавить 3-5 новых ресурсов в каталог

2\. Python SDK (по запросам пользователей)

3\. Dashboard для продавцов (статистика доходов)

4\. Партнёрства с AI-платформами (LangChain, AutoGPT, MCP community)

5\. \*\*Цель: 500 пользователей, 1000 платежей\*\*



\### Месяц 3: Токен и масштабирование

1\. Whitepaper про токен

2\. Смарт-контракт + аудит

3\. Airdrop для ранних пользователей

4\. Листинг на DEX (Uniswap на Base)

5\. Fundraising раунд ($500k-1M)

6\. \*\*Цель: 5000 пользователей, 10k платежей\*\*



\---



\## 3. Каналы рекламы



\### Приоритет 1 (сразу)

\- \*\*GitHub\*\*: open-source SDK, README с примерами, badges (build, npm version)

\- \*\*Twitter/X\*\*: @netthouse, треды про x402/AI agents, демо-видео «агент платит за 3 секунды»

\- \*\*Discord\*\*: сервер для разработчиков (#general, #dev-help, #showcase, #announcements)



\### Приоритет 2 (после 100 пользователей)

\- Reddit: r/CryptoCurrency, r/ethereum, r/Base

\- Base official Discord — featured project

\- Product Hunt (launch day)

\- Hacker News (Show HN)



\### Приоритет 3 (после 500 пользователей)

\- Конференции: ETH Denver, ETH CC, AI Engineer Summit, NeurIPS

\- Питч-конкурсы для стартапов

\- Партнёрства с AI-инфлюенсерами



\---



\## 4. Utility Token NETT



\### Концепция

\- Токен для оплаты API-вызовов внутри платформы

\- Агенты покупают NETT за USDC и тратят на запросы

\- Скидка 10% при оплате в NETT (против USDC) — стимул держателей

\- НЕ security: нет дивидендов, нет доли в компании, только утилити



\### Почему utility, а не security

\- Реальная утилити (оплата API) → ниже риск признания ценной бумагой

\- Ценность растёт от использования платформы, а не от обещаний прибыли

\- Проще листинг на DEX без регуляторных барьеров



\### Tokenomics (черновик)

\- Total supply: 1,000,000,000 NETT

\- Распределение:

&#x20; - 40% — экосистема и airdrop (вестинг 4 года)

&#x20; - 20% — команда (вестинг 4 года, cliff 1 год)

&#x20; - 15% — инвесторы (вестинг 2 года)

&#x20; - 15% — treasury / DAO

&#x20; - 10% — ликвидность (DEX)

\- Дефляция: 1% от каждого платежа сжигается



\### Техническая реализация

1\. ERC-20 на Base (контракт \~1 неделя)

2\. Аудит: CertiK / OpenZeppelin ($10-20k, 2-4 недели)

3\. Интеграция с x402: NETT как второй asset в payment requirements

4\. DEX-листинг: Uniswap v3 на Base (ликвидность $50-100k)

5\. CEX-листинг: через 6-12 месяцев после объёмов (MEXC, Gate.io первыми)



\### Юридические аспекты

\- Компания в crypto-friendly юрисдикции (Сингапур, Швейцария, ОАЭ, BVI)

\- Legal opinion: токен ≠ security (меморандум юрфирмы, $5-15k)

\- KYC/AML для инвесторов в раунде fundraising

\- MiCA compliance для рынка ЕС



\### Таймлайн токена

\- Месяц 3: whitepaper + legal opinion

\- Месяц 4: смарт-контракт + аудит

\- Месяц 5: airdrop + DEX-листинг

\- Месяц 6+: CEX, партнёрства, market maker



\### Риски и митигация

\- SEC/регуляторы → legal opinion + чистая utility-модель

\- Низкая ликвидность → старт с DEX, market maker позже

\- Конкуренты → скорость и фокус на AI agents (никто не делает x402+clearing)



\---



\## 5. Оценка готовности проекта



\*\*Вердикт: MVP-ready.\*\*

Можно запускать и привлекать первых пользователей прямо сейчас.

«100% готовности» не существует: запуск → фидбек → итерации.

Идеальный продукт — враг запущенного продукта.



\---

## 5.5. Собственный facilitator (в процессе)

**Проблема:** публичный facilitator x402.org не поддерживает mainnet.
**Решение:** локальные функции `verify()`/`settle()` внутри нашего API через SDK x402.
**Что готово:**
- ✅ Модуль `src/facilitator/index.ts` (viem + x402/facilitator)
- ✅ Поддержка Base mainnet и Base Sepolia через env
- ✅ Переключение через `X402_NETWORK` и `X402_FACILITATOR_PRIVATE_KEY`
**Что осталось:**
- ⏳ ETH на газовом кошельке `0x2a0F3c5CC59e916E7DB5e3dDC3aEfB632EB2059e` ($3-5)
- ⏳ Переключение middleware (src/middleware/x402.ts) на локальный facilitator
- ⏳ Smoke-тест mainnet
**Блокер:** пополнение ETH через Bybit (или Coinbase)


## 6. Ближайшие шаги (эта неделя)
- [ ] Пополнение газового кошелька ETH на Base (~$3-5 через Bybit)
- [ ] Переключение middleware на локальный facilitator (код готов: src/facilitator/)
- [ ] Mainnet smoke-тест $0.10 (txHash → basescan.org)
- [ ] npm publish @netthouse/sdk
- [ ] GitHub open-source SDK (README, LICENSE)
- [ ] Пост на Hacker News / Twitter


\---



\*Документ обновлён: 21.10.2026. Обновлять по мере закрытия задач.\*

