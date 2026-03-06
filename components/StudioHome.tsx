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
    const base = [{ id: "studio", label: "Studio" as const }];
    if (enhancedEnabled) base.push({ id: "enhanced", label: "Enhanced" as const });
    return base;
  }, [enhancedEnabled]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Safe Export</div>
        <div className="flex gap-2 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-xs">
          {tabs.map((item) => (
            <button
              key={item.id}
              className={`rounded-full px-4 py-1 ${
                tab === item.id ? "bg-white/30 text-[color:var(--text)]" : "text-[color:var(--muted)]"
              }`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {tab === "studio" ? <StudioLite /> : <StudioClient />}
    </div>
  );
}
