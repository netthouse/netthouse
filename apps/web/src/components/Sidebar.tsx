"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { getDictionary } from "@/i18n/dictionaries";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Sidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const { user } = useUser();
  const t = getDictionary(locale);

  const navItems = [
    { href: "/", label: t.nav.dashboard },
    { href: "/organizations", label: t.nav.organizations },
    { href: "/accounts", label: t.nav.accounts },
    { href: "/transactions", label: t.nav.transactions },
    { href: "/api-keys", label: t.nav.apiKeys },
    { href: "/clearing", label: t.nav.clearing },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col">
               <div className="mb-6">
        <img src="/netthouse-horizontal-white.svg" alt="Netthouse" className="h-8 w-auto" />
        <p className="text-xs text-slate-400 mt-1">AI Payments Platform</p>
      </div>

      <div className="mb-6">
        <LanguageSwitcher locale={locale} />
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-slate-700 text-white font-medium"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-700">
        {user && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium truncate">
              {user.fullName ?? user.primaryEmailAddress?.emailAddress}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        )}
        <SignOutButton>
          <button className="w-full px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left">
            {t.signOut}
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}