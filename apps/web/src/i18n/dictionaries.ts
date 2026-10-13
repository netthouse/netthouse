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
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, ru };

export function getDictionary(locale: string): Dictionary {
  return (locales as readonly string[]).includes(locale)
    ? dictionaries[locale as Locale]
    : dictionaries[defaultLocale];
}