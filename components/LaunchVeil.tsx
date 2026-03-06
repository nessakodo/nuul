"use client";

import { useEffect, useRef, useState } from "react";
import anime from "animejs";

const veilKey = "nuul-launch-veil";

export default function LaunchVeil() {
  const [visible, setVisible] = useState(false);
  const veilRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(veilKey) === "true";
    if (seen) return;
    setVisible(true);
    sessionStorage.setItem(veilKey, "true");
  }, []);

  useEffect(() => {
    if (!visible || !veilRef.current) return;
    const animation = anime({
      targets: veilRef.current,
      opacity: [1, 0],
      duration: 1200,
      easing: "easeOutQuad",
      delay: 400,
      complete: () => setVisible(false)
    });
    return () => animation.pause();
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={veilRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 text-center text-sm text-white"
    >
      <div className="relative">
        <div className="orb absolute inset-0 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        <div className="rounded-3xl border border-white/20 bg-white/10 px-6 py-5 backdrop-blur">
          <div className="text-[0.6rem] uppercase tracking-[0.4em] text-white/60">NUUL</div>
          <div className="mt-2 text-base">Safe Export Studio</div>
          <div className="mt-1 text-xs text-white/60">Local first. No uploads. No accounts.</div>
        </div>
      </div>
    </div>
  );
}
