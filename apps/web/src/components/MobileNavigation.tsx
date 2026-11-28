"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { getDictionary, type Locale } from "@/i18n/dictionaries";
import OrgSwitcher from "@/components/OrgSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type Org = { id: string; name: string; slug: string };
type NavItem = { href: string; label: string; icon: "home" | "accounts" | "transactions" | "billing" };

function Icon({ name }: { name: NavItem["icon"] | "menu" | "close" }) {
  const common = {
    className: name === "menu" ? "h-6 w-6" : "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "home") return <svg {...common}><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></svg>;
  if (name === "accounts") return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></svg>;
  if (name === "transactions") return <svg {...common}><path d="M7 7h13M7 7l3-3M7 7l3 3M17 17H4m13 0-3-3m3 3-3 3" /></svg>;
  if (name === "billing") return <svg {...common}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h4" /></svg>;
  if (name === "close") return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
  return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}

export default function MobileNavigation({
  locale,
  orgs,
  currentOrgId,
}: {
  locale: Locale;
  orgs: Org[];
  currentOrgId: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLElement | null>(null);
  const t = getDictionary(locale);
  const currentOrg = orgs.find((org) => org.id === currentOrgId);

  const primary: NavItem[] = [
    { href: "/", label: t.nav.dashboard, icon: "home" },
    { href: "/accounts", label: t.nav.accounts, icon: "accounts" },
    { href: "/transactions", label: t.nav.transactions, icon: "transactions" },
    { href: "/billing", label: t.nav.billing, icon: "billing" },
  ];
  const allRoutes = [
    { href: "/", label: t.nav.dashboard },
    { href: "/organizations", label: t.nav.organizations },
    { href: "/accounts", label: t.nav.accounts },
    { href: "/transactions", label: t.nav.transactions },
    { href: "/api-keys", label: t.nav.apiKeys },
    { href: "/clearing", label: t.nav.clearing },
    { href: "/payments", label: t.nav.payments },
    { href: "/commission", label: t.nav.commission },
    { href: "/billing", label: t.nav.billing },
  ];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = menuPanelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select:not([disabled]), input:not([disabled])'
      );
      if (!focusable?.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [open]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="mobile-dashboard-header sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden">
        <Link href="/" className="shrink-0" aria-label="Netthouse dashboard">
          <img src="/netthouse-horizontal-white.svg" alt="Netthouse" className="h-8 w-auto brightness-0" />
        </Link>
        <div className="min-w-0 flex-1 truncate text-right text-sm font-semibold text-slate-600" title={currentOrg?.name ?? t.common.noOrg}>
          {currentOrg?.name ?? t.common.noOrg}
        </div>
        <button
          type="button"
          ref={menuButtonRef}
          onClick={() => setOpen(true)}
          aria-label={locale === "ru" ? "Открыть меню" : "Open menu"}
          aria-expanded={open}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Icon name="menu" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/45"
            onClick={() => setOpen(false)}
            aria-label={locale === "ru" ? "Закрыть меню" : "Close menu"}
          />
          <section
            ref={menuPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label={locale === "ru" ? "Навигация" : "Navigation"}
            className="relative ml-auto flex h-full w-[min(88vw,360px)] flex-col overflow-y-auto bg-slate-900 p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] text-white shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <img src="/netthouse-horizontal-white.svg" alt="Netthouse" className="h-7 w-auto" />
              <button
                type="button"
                ref={closeButtonRef}
                onClick={() => setOpen(false)}
                aria-label={locale === "ru" ? "Закрыть меню" : "Close menu"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="mb-5">
              <OrgSwitcher orgs={orgs} currentOrgId={currentOrgId} locale={locale} />
            </div>
            <div className="mb-5 border-b border-slate-700 pb-5">
              <p className="mb-2 text-xs text-slate-400">{locale === "ru" ? "Язык" : "Language"}</p>
              <LanguageSwitcher locale={locale} />
            </div>
            <nav aria-label={locale === "ru" ? "Разделы панели" : "Dashboard sections"} className="space-y-1">
              {allRoutes.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-lg px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isActive(item.href) ? "bg-slate-700 font-medium text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t border-slate-700 pt-4">
              <SignOutButton>
                <button className="min-h-11 w-full rounded-lg px-3 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                  {t.signOut}
                </button>
              </SignOutButton>
            </div>
          </section>
        </div>
      )}

      <nav aria-label={locale === "ru" ? "Основная навигация" : "Primary navigation"} className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white/95 px-1 pt-1 backdrop-blur md:hidden">
        {primary.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-md px-1 text-[10px] leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 ${
                active ? "font-semibold text-blue-700" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon name={item.icon} />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
