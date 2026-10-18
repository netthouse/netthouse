import { cookies } from "next/headers";
import { getDictionary } from "@/i18n/dictionaries";

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const t = getDictionary(locale);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{t.pages.dashboard.title}</h1>
      <p className="mt-2 text-slate-600">{t.pages.dashboard.subtitle}</p>
    </div>
  );
}