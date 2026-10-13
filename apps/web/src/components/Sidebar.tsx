"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/organizations", label: "Organizations" },
  { href: "/accounts", label: "Accounts" },
  { href: "/transactions", label: "Transactions" },
  { href: "/api-keys", label: "API Keys" },
  { href: "/clearing", label: "Clearing" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Netthouse</h1>
        <p className="text-xs text-slate-400">AI Payments Platform</p>
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
            <p className="text-sm font-medium truncate">{user.fullName ?? user.primaryEmailAddress?.emailAddress}</p>
            <p className="text-xs text-slate-400 truncate">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        )}
        <SignOutButton>
          <button className="w-full px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-left">
            Sign out
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}