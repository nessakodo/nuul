"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import GradientBackdrop from "@/components/GradientBackdrop";
import GlassPanel from "@/components/GlassPanel";

interface ReceiptCard {
  timestamp: string;
  summary: string;
  json: string;
  found: string[];
  changed: string[];
  remaining: string[];
  tips: string[];
}

const receiptKey = "nuul-receipts";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptCard[]>([]);
  const [selected, setSelected] = useState<ReceiptCard | null>(null);

  useEffect(() => {
    const stored = JSON.parse(window.localStorage.getItem(receiptKey) ?? "[]") as string[];
    const parsed = stored
      .map((entry) => {
        try {
          const json = JSON.parse(entry) as {
            timestamp: string;
            changed: { label: string }[];
            found?: { label: string }[];
            remaining?: { label: string }[];
            tips?: string[];
          };
          return {
            timestamp: json.timestamp,
            summary: json.changed.map((action) => action.label).join(", "),
            json: entry,
            found: (json.found ?? []).map((item) => item.label),
            changed: (json.changed ?? []).map((item) => item.label),
            remaining: (json.remaining ?? []).map((item) => item.label),
            tips: json.tips ?? []
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean) as ReceiptCard[];
    setReceipts(parsed);
    setSelected(parsed[0] ?? null);
  }, []);

  const downloadReceipt = (json: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    link.download = "nuul-receipt.json";
    link.click();
  };

  return (
    <AppShell>
      <GradientBackdrop />
      <GlassPanel className="p-8">
        <h1 className="text-2xl font-semibold">Receipts</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Your export receipts live locally. Enable Receipt Vault in settings to keep a private ledger of changes.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          {receipts.length ? (
            receipts.map((receipt) => (
              <div key={receipt.timestamp} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  {new Date(receipt.timestamp).toLocaleString()}
                </div>
                <div className="mt-2 text-sm font-semibold">Safe export</div>
                <div className="mt-2 text-xs text-[color:var(--muted)]">{receipt.summary}</div>
                <button
                  className="mt-4 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs"
                  onClick={() => setSelected(receipt)}
                >
                  View details
                </button>
                <button
                  className="mt-2 w-full rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs"
                  onClick={() => downloadReceipt(receipt.json)}
                >
                  Download JSON
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-[color:var(--muted)]">
              No receipts yet. Export a sanitized file to generate your first receipt.
            </div>
          )}
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Receipt</div>
            {selected ? (
              <div className="mt-3 space-y-4 text-sm text-[color:var(--muted)]">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em]">What we found</div>
                  <div className="mt-1">{selected.found.length ? selected.found.join(", ") : "No findings recorded."}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em]">What we changed</div>
                  <div className="mt-1">{selected.changed.length ? selected.changed.join(", ") : "No changes recorded."}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em]">What remains</div>
                  <div className="mt-1">{selected.remaining.length ? selected.remaining.join(", ") : "Nothing flagged."}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em]">Tip</div>
                  <div className="mt-1">{selected.tips[0] ?? "Review your export before sharing."}</div>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-[color:var(--muted)]">Select a receipt to view details.</div>
            )}
          </div>
        </div>
      </GlassPanel>
    </AppShell>
  );
}
