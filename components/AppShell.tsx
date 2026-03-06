"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/studio", label: "Studio" },
  { href: "/receipts", label: "Receipts" },
  { href: "/settings", label: "Settings" }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen px-6 pb-12 pt-8 lg:px-12">
      <nav className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-lg font-semibold tracking-[0.3em]">NUUL</div>
        <div className="flex gap-2 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-sm">
          {tabs.map((tab) => {
            const active = pathname?.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-full px-4 py-1 transition ${
                  active
                    ? "bg-white/30 text-[color:var(--text)]"
                    : "text-[color:var(--muted)] hover:text-[color:var(--text)]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          <Link href="/privacy">Privacy</Link>
          <Link href="/threat-model">Threat model</Link>
        </div>
      </nav>
      <main className="mt-10">{children}</main>
    </div>
  );
}
