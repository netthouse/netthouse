"use client";

import { useRouter } from "next/navigation";

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const router = useRouter();

  const setLocale = (next: string) => {
    document.cookie = `locale=${next}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <div className="inline-flex overflow-hidden rounded-md border border-slate-700">
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`min-h-11 min-w-12 px-3 py-2 text-xs font-medium transition-colors ${
          locale === "en" ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("ru")}
        aria-pressed={locale === "ru"}
        className={`min-h-11 min-w-12 px-3 py-2 text-xs font-medium transition-colors ${
          locale === "ru" ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800"
        }`}
      >
        RU
      </button>
    </div>
  );
}
