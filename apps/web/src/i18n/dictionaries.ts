export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const en = {
  nav: {
    dashboard: "Dashboard",
    organizations: "Organizations",
    accounts: "Accounts",
    transactions: "Transactions",
    apiKeys: "API Keys",
    clearing: "Clearing",
    payments: "Payments",
  },
  signOut: "Sign out",
  pages: {
    organizations: {
      title: "Organizations",
      name: "Name",
      slug: "Slug",
      created: "Created",
      empty: "No organizations yet",
    },
    accounts: { title: "Accounts", created: "Created" },
    transactions: { title: "Transactions (Ledger)", empty: "No transactions yet" },
    apiKeys: {
      title: "API Keys",
      name: "Name",
      key: "Key",
      scopes: "Scopes",
      status: "Status",
      lastUsed: "Last used",
      never: "never",
      active: "active",
      revoked: "revoked",
    },
    clearing: {
      title: "Clearing Engine",
      gross: "Gross flow",
      net: "Net flow",
      saved: "Total saved",
      proposals: "Netting proposals",
      from: "From",
      to: "To",
      netAmount: "Net amount",
      noNetting: "No netting needed",
      noData: "No data available",
    },
    payments: {
      title: "x402 Payments",
      txHash: "Tx Hash",
      from: "Payer",
      amount: "Amount",
      resource: "Resource",
      date: "Date",
      empty: "No payments yet. Run demo-agent to create some.",
      noOrg: "Select an organization to view payments",
    },
  },
};

export type Dictionary = typeof en;

const ru: Dictionary = {
  nav: {
    dashboard: "Панель",
    organizations: "Организации",
    accounts: "Счета",
    transactions: "Транзакции",
    apiKeys: "API ключи",
    clearing: "Клиринг",
    payments: "Платежи",
  },
  signOut: "Выйти",
  pages: {
    organizations: {
      title: "Организации",
      name: "Название",
      slug: "Slug",
      created: "Создана",
      empty: "Организаций пока нет",
    },
    accounts: { title: "Счета", created: "Создан" },
    transactions: { title: "Транзакции (главная книга)", empty: "Транзакций пока нет" },
    apiKeys: {
      title: "API ключи",
      name: "Название",
      key: "Ключ",
      scopes: "Права",
      status: "Статус",
      lastUsed: "Последнее использование",
      never: "никогда",
      active: "активен",
      revoked: "отозван",
    },
    clearing: {
      title: "Клиринговый движок",
      gross: "Валовый поток",
      net: "Чистый поток",
      saved: "Экономия",
      proposals: "План взаимозачёта",
      from: "Отправитель",
      to: "Получатель",
      netAmount: "Сумма",
      noNetting: "Взаимозачёт не требуется",
      noData: "Нет данных",
    },
    payments: {
      title: "Платежи x402",
      txHash: "Хеш транзакции",
      from: "Плательщик",
      amount: "Сумма",
      resource: "Ресурс",
      date: "Дата",
      empty: "Платежей пока нет. Запустите demo-agent, чтобы создать.",
      noOrg: "Выберите организацию, чтобы посмотреть платежи",
    },
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ru };

export function getDictionary(locale: string): Dictionary {
  return (locales as readonly string[]).includes(locale)
    ? dictionaries[locale as Locale]
    : dictionaries[defaultLocale];
}