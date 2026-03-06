"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import IntroSequence from "@/components/IntroSequence";

const tabs = [
  { href: "/studio", label: "Studio" },
  { href: "/receipts", label: "Receipts" },
  { href: "/settings", label: "Settings" }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen px-6 pb-12 pt-8 lg:px-12">
      <IntroSequence />
      <nav className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="text-center text-lg font-semibold tracking-[0.3em] md:text-left">NUUL</div>
        <div className="flex justify-center">
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
        </div>
        <div className="flex items-center justify-center gap-4 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)] md:justify-end">
          <Link href="/privacy">Privacy</Link>
          <Link href="/threat-model">Threat model</Link>
        </div>
      </nav>
      <main className="mt-10">{children}</main>
    </div>
  );
}
