"use client";

import { useEffect, useMemo, useState } from "react";
import anime from "animejs";
import { playChime } from "@/lib/sfx";
import Link from "next/link";

const introKey = "nuul-intro-seen";

export default function IntroSequence() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem(introKey) === "true";
    if (seen) return;
    setVisible(true);
    sessionStorage.setItem(introKey, "true");
    const timers = [
      window.setTimeout(() => setPhase(1), 200),
      window.setTimeout(() => setPhase(2), 900),
      window.setTimeout(() => setPhase(3), 1800),
      window.setTimeout(() => setPhase(4), 2600)
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (!visible) return;
    anime({
      targets: ".nuul-intro-orb",
      opacity: [0.2, 0.8],
      scale: [0.9, 1.08],
      easing: "easeInOutSine",
      duration: 7000,
      direction: "alternate",
      loop: true
    });
  }, [visible]);

  const ready = useMemo(() => phase >= 4, [phase]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 text-white">
      <div className="absolute inset-0">
        <div className="nuul-intro-orb orb absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>

      <div
        className={`relative z-10 text-center transition-all duration-700 ${
          phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="text-[0.6rem] uppercase tracking-[0.5em] text-white/60">NUUL STUDIO</div>
        <div className="mt-4 text-5xl font-semibold tracking-[-0.03em]">Safe Export</div>
        <div className="mt-3 text-sm text-white/60">
          Local-first privacy for screenshots. No uploads. No accounts.
        </div>

        <div
          className={`mt-10 flex flex-wrap items-center justify-center gap-3 transition-all duration-700 ${
            ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/studio"
            onClick={() => playChime()}
            className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-xs uppercase tracking-[0.2em] backdrop-blur"
          >
            Enter Studio
          </Link>
          <Link
            href="/studio"
            onClick={() => playChime()}
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white/70"
          >
            Start With Filters
          </Link>
        </div>
      </div>
    </div>
  );
}
