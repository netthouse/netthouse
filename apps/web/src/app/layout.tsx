import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ruRU } from "@clerk/localizations";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import { getOrgsForUser, getCurrentOrg } from "@/lib/org";
import "./globals.css";

export const metadata: Metadata = {
  title: "Netthouse - Dashboard",
  description: "AI Agent Payments Platform",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value ?? "en";
  const { userId } = await auth();
  const orgs = userId ? await getOrgsForUser() : [];
  const currentOrg = userId ? await getCurrentOrg(orgs) : null;

  return (
  <ClerkProvider
  localization={locale === "ru" ? ruRU : undefined}
  allowedRedirectOrigins={["https://app.netthouse.com"]}
>

      <html lang={locale}>
        <body className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 antialiased">
          {userId ? (
            <div className="min-h-screen md:flex">
              <Sidebar
                locale={locale}
                orgs={orgs}
                currentOrgId={currentOrg?.id ?? null}
              />
              <div className="min-w-0 flex-1">
                <MobileNavigation
                  locale={locale as "en" | "ru"}
                  orgs={orgs}
                  currentOrgId={currentOrg?.id ?? null}
                />
                <main className="min-h-[calc(100vh-3.5rem)] min-w-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:min-h-screen md:pb-0">
                  {children}
                </main>
              </div>
            </div>
          ) : (
            children
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}
