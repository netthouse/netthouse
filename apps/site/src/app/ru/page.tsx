export const metadata = {
  title: "Netthouse — платёжная инфраструктура для AI-агентов",
  description: "Двойная запись, x402 HTTP-платежи и автоматический клиринг для автономных агентов.",
};

export default function HomePageRU() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
           <a href="/" className="flex items-center">
            <img src="/netthouse-horizontal-color.svg" alt="Netthouse" className="h-8 w-auto" />
          </a>
          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#how" className="text-slate-600 hover:text-slate-900">Как работает</a>
            <a href="#features" className="text-slate-600 hover:text-slate-900">Возможности</a>
            <a href="#use-cases" className="text-slate-600 hover:text-slate-900">Применение</a>
            <a href="/docs" className="text-slate-600 hover:text-slate-900">Документация</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900">Тарифы</a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 text-xs">
              <a href="/" className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200">EN</a>
              <a href="/ru" className="px-2 py-1 bg-slate-900 text-white rounded">RU</a>
            </div>
            <a
              href="https://app.netthouse.com"
              className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800"
            >
              Войти
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Работает на netthouse.com
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            Платёжная инфраструктура
            <br />
            <span className="text-slate-400">для AI-агентов</span>
          </h1>
          <p className="mt-8 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Двойная запись, HTTP-native платежи (x402) и автоматический клиринг. Ваши агенты платят, получают и сводят остатки — вы не переводите ни цента.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <a
              href="https://app.netthouse.com"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 shadow-sm"
            >
              Открыть дашборд →
            </a>
            <a
              href="/docs"
              className="px-6 py-3 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50"
            >
              Читать документацию
            </a>
          </div>
        </section>

        <section id="how" className="border-t border-slate-200 py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Как это работает</h2>
            <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16">
              Четыре шага от регистрации до проведённых платежей. Без SDK, без интеграций — только HTTP.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Step num="1" title="Создайте организацию" text="Одно рабочее пространство на команду. Изолированные данные, ограниченные ключи." />
              <Step num="2" title="Выпустите API-ключи" text="Admin, write, read, transact — гранулярные права из коробки." />
              <Step num="3" title="Агенты совершают транзакции" text="Сбалансированные проводки через REST или x402-заголовки на любом HTTP-вызове." />
              <Step num="4" title="Сведите остатки" text="Встречные потоки автоматически клирятся. Платите только разницу." />
            </div>
          </div>
        </section>

        <section id="features" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Создано для экономики агентов</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Feature
                emoji="📒"
                title="Двойная запись"
                description="Каждая транзакция сбалансирована. Деньги не создаются и не уничтожаются — только перемещаются между счетами. Готово к аудиту с первого дня."
              />
              <Feature
                emoji="⚡"
                title="x402 HTTP-платежи"
                description="Агенты платят за HTTP-запросы за один round-trip. Без сессий, без токенов, без счетов. Просто 402 и заголовок X-PAYMENT."
              />
              <Feature
                emoji="⚖️"
                title="Автоматический клиринг"
                description="Встречные потоки между счетами сводятся. Экономия 30–70% на валовых переводах без таблиц."
              />
              <Feature
                emoji="🔑"
                title="API-ключи с правами"
                description="Выпускайте ключи с гранулярными правами: admin, write, read, transact. Отзывайте в любой момент. Никаких общих секретов."
              />
              <Feature
                emoji="💱"
                title="Мультивалютность"
                description="USD, EUR, токены — у каждого счёта своя валюта. Балансы остаются точными, без путаницы с кросс-курсами."
              />
              <Feature
                emoji="🛡️"
                title="Аутентификация и аудит"
                description="Каждое изменение привязано к пользователю Clerk. Полная история кто, что, когда и почему сделал."
              />
            </div>
          </div>
        </section>

        <section id="use-cases" className="py-24 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Применение</h2>
            <p className="text-center text-slate-400 max-w-2xl mx-auto mb-16">
              Где Netthouse окупается в первую неделю.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UseCase
                title="Шлюзы для AI-агентов"
                text="Берите плату с LLM-провайдеров, API-инструментов и источников данных за каждый вызов. Агенты рассчитываются в реальном времени — без предоплаты, без сверки."
              />
              <UseCase
                title="MCP-серверы"
                text="Монетизируйте свой Model Context Protocol сервер. Клиенты платят через x402, вы ведёте чистый реестр и сводите остатки в конце месяца."
              />
              <UseCase
                title="Маркетплейсы агент-агент"
                text="Позвольте агентам покупать услуги друг у друга. Netthouse клирирует двусторонние потоки, так что движется только чистая сумма."
              />
              <UseCase
                title="Атрибуция затрат"
                text="Видите точно сколько потратил каждый агент, задача или проект. Сворачивайте по организации, агенту или счёту — готово для финотдела."
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-4">Простые тарифы</h2>
            <p className="text-center text-slate-600 max-w-2xl mx-auto mb-16">
              Бесплатно пока вы разрабатываете. Платите когда масштабируетесь.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Price
                name="Hobby"
                price="Бесплатно"
                desc="Для экспериментов и пет-проектов"
                features={["1 организация", "10k транзакций/месяц", "Поддержка сообщества"]}
                highlight={false}
              />
              <Price
                name="Pro"
                price="$29"
                desc="В месяц, за организацию"
                features={["Неограниченно организаций", "1M транзакций/месяц", "Приоритетная поддержка", "Свои домены"]}
                highlight={false}
              />
              <Price
                name="Startup"
                price="$99"
                desc="Для команд, запускающих продукты с агентами"
                features={["Всё из Pro", "10M транзакций/месяц", "Журналы аудита", "Поддержка в Slack"]}
                highlight={true}
              />
              <Price
                name="Enterprise"
                price="По запросу"
                desc="Для регулируемых нагрузок"
                features={["SLA и on-prem", "SSO / SAML", "Выделенный CSM", "Пользовательские правила клиринга"]}
                highlight={false}
              />
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Начните за 5 минут</h2>
            <p className="text-slate-600 mb-8">
              Без карты. Без звонка менеджеру. Зарегистрируйтесь, создайте организацию и проведите первую транзакцию.
            </p>
            <a
              href="https://app.netthouse.com"
              className="inline-block px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
            >
              Создать организацию →
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
        <img src="/netthouse-horizontal-color.svg" alt="Netthouse" className="h-7 w-auto mb-3" />
              <p className="text-sm text-slate-500">
                Платёжная инфраструктура для AI-агентов.
              </p>
            </div>
            <FooterCol title="Продукт" links={["Возможности", "Тарифы", "Документация", "История изменений"]} />
            <FooterCol title="Компания" links={["О нас", "Блог", "Контакты"]} />
            <FooterCol title="Юридическое" links={["Конфиденциальность", "Условия", "Безопасность"]} />
          </div>
          <div className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            © 2026 Netthouse. Сделано с ❤️ для экономики агентов.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Step({ num, title, text }: { num: string; title: string; text: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
        {num}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
}

function Feature({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function UseCase({ title, text }: { title: string; text: string }) {
  return (
    <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function Price({
  name,
  price,
  desc,
  features,
  highlight,
}: {
  name: string;
  price: string;
  desc: string;
  features: string[];
  highlight: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-lg border ${
        highlight
          ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-105"
          : "bg-white border-slate-200"
      }`}
    >
      <h3 className={`text-lg font-semibold ${highlight ? "text-white" : "text-slate-900"}`}>{name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className={`text-4xl font-bold ${highlight ? "text-white" : "text-slate-900"}`}>{price}</span>
        {price !== "Бесплатно" && price !== "По запросу" && (
          <span className={`text-sm ${highlight ? "text-slate-400" : "text-slate-500"}`}>/мес</span>
        )}
      </div>
      <p className={`mt-2 text-sm ${highlight ? "text-slate-400" : "text-slate-600"}`}>{desc}</p>
      <ul className={`mt-6 space-y-2 text-sm ${highlight ? "text-slate-300" : "text-slate-600"}`}>
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className={highlight ? "text-green-400" : "text-green-600"}>✓</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}