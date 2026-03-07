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
      <nav className="mx-auto flex max-w-6xl items-center justify-center">
        <div className="text-center text-sm font-semibold tracking-[0.4em] text-[color:var(--muted)]">NUUL</div>
      </nav>
      <main className="mt-10">{children}</main>
    </div>
  );
}
