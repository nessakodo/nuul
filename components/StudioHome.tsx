"use client";

import { useEffect, useMemo, useState } from "react";
import StudioLite from "@/components/StudioLite";
import StudioClient from "@/components/StudioClient";

export default function StudioHome() {
  const [enhancedEnabled, setEnhancedEnabled] = useState(false);
  const [tab, setTab] = useState<"studio" | "enhanced">("studio");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const enhanced = params.get("enhanced") === "1" || window.localStorage.getItem("nuul-enhanced") === "true";
    setEnhancedEnabled(enhanced);
    if (params.get("enhanced") === "1") setTab("enhanced");
  }, []);

  const tabs = useMemo(() => {
    const base: Array<{ id: "studio" | "enhanced"; label: string }> = [{ id: "studio", label: "Studio" }];
    if (enhancedEnabled) base.push({ id: "enhanced", label: "Enhanced" });
    return base;
  }, [enhancedEnabled]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">Safe Export</div>
        <div className="flex items-center gap-3">
          <div className="text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--muted)]">Enhanced</div>
          <button
            className={`h-7 w-12 rounded-full border transition ${
              enhancedEnabled ? "border-white/40 bg-white/30" : "border-white/10 bg-white/5"
            }`}
            onClick={() => {
              const next = !enhancedEnabled;
              setEnhancedEnabled(next);
              window.localStorage.setItem("nuul-enhanced", String(next));
              if (!next) setTab("studio");
              if (next) setTab("enhanced");
            }}
            aria-label="Toggle enhanced mode"
          >
            <span
              className={`block h-5 w-5 translate-x-1 rounded-full bg-white/80 transition ${
                enhancedEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
      {tab === "studio" ? <StudioLite /> : <StudioClient />}
    </div>
  );
}
