import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const t = getDictionary(locale);

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold sm:text-3xl">{t.pages.dashboard.title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">{t.pages.dashboard.subtitle}</p>
    </div>
  );
}
