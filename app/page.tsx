import Link from "next/link";
import GradientBackdrop from "@/components/GradientBackdrop";
import GlassPanel from "@/components/GlassPanel";

export default function Home() {
  return (
    <div className="min-h-screen px-6 pb-16 pt-10 lg:px-16">
      <GradientBackdrop />
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
          <span>NUUL</span>
          <span>Safe Export Studio</span>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
              Safe Export for screenshots, without uploads or accounts.
            </h1>
            <p className="mt-4 text-base text-[color:var(--muted)]">
              NUUL scans for accidental leaks — emails, phone numbers, addresses, QR codes, API keys, tokens, seed
              phrases, and browser chrome — then guides you to a calm, local-only export.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/studio"
                className="rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-black"
              >
                Open Studio
              </Link>
              <Link
                href="/privacy"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm"
              >
                Privacy promise
              </Link>
            </div>
          </div>
          <GlassPanel className="p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Local first. No uploads. No accounts.
            </div>
            <div className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              <p>Processing stays on device. No remote storage. No third-party analytics by default.</p>
              <p>Designed for calm, premium exports — not fear or anonymity claims.</p>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
