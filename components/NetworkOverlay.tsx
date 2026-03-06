"use client";

import { useEffect, useState } from "react";
import { getNetworkCount, getNetworkStart } from "@/lib/monitor/network";

const overlayKey = "nuul-dev-overlay";

export default function NetworkOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [count, setCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(overlayKey) === "true";
    setEnabled(stored);
    setStartedAt(getNetworkStart());
    const interval = window.setInterval(() => {
      setCount(getNetworkCount());
      setEnabled(window.localStorage.getItem(overlayKey) === "true");
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  if (!enabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-white/20 bg-black/70 px-4 py-3 text-xs text-white backdrop-blur">
      <div className="text-[0.6rem] uppercase tracking-[0.3em] text-white/70">Network Monitor</div>
      <div className="mt-1 text-sm">Requests: {count}</div>
      <div className="text-[0.6rem] text-white/60">Since: {startedAt ? new Date(startedAt).toLocaleTimeString() : "--"}</div>
    </div>
  );
}
