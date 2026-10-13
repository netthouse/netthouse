"use client";

import { useRouter } from "next/navigation";

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const router = useRouter();

  const setLocale = (next: string) => {
    document.cookie = `locale=${next}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <div className="inline-flex rounded-md overflow-hidden border border-slate-700">
      <button
        onClick={() => setLocale("en")}
        className={`px-3 py-1 text-xs font-medium transition-colors ${
          locale === "en" ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("ru")}
        className={`px-3 py-1 text-xs font-medium transition-colors ${
          locale === "ru" ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800"
        }`}
      >
        RU
      </button>
    </div>
  );
}