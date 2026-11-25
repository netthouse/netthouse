import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ruRU } from "@clerk/localizations";
import Sidebar from "@/components/Sidebar";
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
        <body className="bg-slate-50 text-slate-900 antialiased">
          <div className="flex">
            {userId && (
              <Sidebar
                locale={locale}
                orgs={orgs}
                currentOrgId={currentOrg?.id ?? null}
              />
            )}
            <main className="flex-1 min-h-screen">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}