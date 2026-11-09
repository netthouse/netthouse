import { SignIn } from "@clerk/nextjs";
import { cookies, headers } from "next/headers";
import { ruRU } from "@clerk/localizations";
import { netthouseAppearance } from "@/lib/clerk-theme";

export default async function SignInPage() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language") ?? "";
  const locale =
    cookieStore.get("locale")?.value ??
    (acceptLanguage.toLowerCase().includes("ru") ? "ru" : "en");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <SignIn
        path="/sign-in"
        appearance={netthouseAppearance}
        localization={locale === "ru" ? ruRU : undefined}
      />
    </div>
  );
}