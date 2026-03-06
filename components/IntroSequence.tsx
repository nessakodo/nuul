"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import anime from "animejs";
import { playHover, playReveal, startDrone } from "@/lib/sfx";
import { useRouter } from "next/navigation";

const introKey = "nuul-intro-seen";

export default function IntroSequence() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    if (!visible) return;
    const handler = () => {
      startDrone();
      window.removeEventListener("pointerdown", handler);
    };
    window.addEventListener("pointerdown", handler, { once: true });
    return () => window.removeEventListener("pointerdown", handler);
  }, [visible]);

  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const points = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.35 - 0.05,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.35 + 0.05
    }));

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,162,107,${p.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [visible]);

  const ready = useMemo(() => phase >= 4, [phase]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 text-white backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0">
        <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
        <div className="scanline-layer absolute inset-0 opacity-30" />
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
          className={`mt-10 grid w-full max-w-lg gap-3 transition-all duration-700 ${
            ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {[
            { label: "Start with filters", href: "/studio?mode=filters", tone: "primary" },
            { label: "Enter safe export", href: "/studio", tone: "secondary" },
            { label: "Explore receipts", href: "/receipts", tone: "ghost" }
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => {
                playReveal();
                router.push(action.href);
              }}
              onMouseEnter={() => playHover()}
              className={`rounded-2xl border px-6 py-3 text-xs uppercase tracking-[0.2em] backdrop-blur transition ${
                action.tone === "primary"
                  ? "border-white/30 bg-white/15 text-white"
                  : action.tone === "secondary"
                    ? "border-white/20 bg-white/10 text-white/80"
                    : "border-white/10 bg-white/5 text-white/60"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
