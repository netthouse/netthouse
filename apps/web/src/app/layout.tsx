import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ClerkProvider } from "@clerk/nextjs";
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
  const orgs = await getOrgsForUser();
  const currentOrg = await getCurrentOrg();

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body className="bg-slate-50 text-slate-900 antialiased">
          <div className="flex">
            <Sidebar
              locale={locale}
              orgs={orgs}
              currentOrgId={currentOrg?.id ?? null}
            />
            <main className="flex-1 min-h-screen">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}