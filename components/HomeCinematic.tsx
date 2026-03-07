"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import anime from "animejs";
import GradientBackdrop from "@/components/GradientBackdrop";
import { playHover, startDrone } from "@/lib/sfx";

const filters = [
  { name: "Graphite", note: "Matte blacks, clean UI", hue: "#1b1d22", width: 200, height: 280 },
  { name: "Warm Film", note: "Soft amber shadows", hue: "#3a2b22", width: 180, height: 240 },
  { name: "Soft Grain", note: "Muted highlights", hue: "#2a2c33", width: 170, height: 230 },
  { name: "Noir", note: "High contrast grit", hue: "#16181c", width: 190, height: 260 },
  { name: "Studio", note: "Muted neutrals", hue: "#2c2422", width: 210, height: 300 },
  { name: "Chrome", note: "Cold clean edges", hue: "#222a33", width: 175, height: 220 },
  { name: "Dusk", note: "Blue hour haze", hue: "#2a2434", width: 185, height: 250 },
  { name: "Ritual", note: "Gold undertones", hue: "#3c2d23", width: 205, height: 270 },
  { name: "Mercury", note: "Silver night", hue: "#24282e", width: 165, height: 210 },
  { name: "Nightfall", note: "Satin shadows", hue: "#14151a", width: 195, height: 265 },
  { name: "Sable", note: "Muted slate", hue: "#1a1c20", width: 175, height: 230 },
  { name: "Lumen", note: "Soft glow", hue: "#2a2520", width: 185, height: 240 }
];

export default function HomeCinematic() {
  const [phase, setPhase] = useState<"intro" | "orbit" | "exit" | "cta">("intro");
  const [reducedMotion, setReducedMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const handler = () => setReducedMotion(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      startDrone();
      window.removeEventListener("pointerdown", handler);
    };
    window.addEventListener("pointerdown", handler, { once: true });
    return () => window.removeEventListener("pointerdown", handler);
  }, []);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase("orbit"), 600),
      window.setTimeout(() => setPhase("exit"), 6400),
      window.setTimeout(() => setPhase("cta"), 7600)
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (!ringRef.current || reducedMotion) return;
    anime({
      targets: ringRef.current,
      keyframes: [
        { rotateY: 240, duration: 5200, easing: "easeOutSine" },
        { rotateY: 720, duration: 1400, easing: "easeInCubic" }
      ],
      loop: false
    });
  }, [reducedMotion]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const points = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -Math.random() * 0.35 - 0.05,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.35 + 0.05
    }));

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -30) {
          p.y = canvas.height + 30;
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
  }, []);

  const ringStyle = useMemo(
    () => ({
      transform: reducedMotion ? "none" : "translateZ(0)",
      marginLeft: 0,
      marginRight: 0
    }),
    [reducedMotion]
  );

  return (
    <div className="relative min-h-screen bg-black text-white">
      <GradientBackdrop />
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-10 text-center">
        <div className="pointer-events-none absolute inset-0">
          <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
          <div className="scanline-layer absolute inset-0 opacity-30" />
          <div className="liquid-orb absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/95" />
        </div>

        <div className="relative z-10 -mt-2 max-w-2xl transition-all duration-700">
          <div
            className={`text-[0.7rem] uppercase tracking-[0.6em] ${
              phase === "cta" ? "opacity-0 -translate-y-3" : "opacity-100 translate-y-0"
            } bg-gradient-to-r from-[#e0c9a0] via-[#bda47a] to-[#7c6a54] bg-clip-text text-transparent transition-all duration-700`}
          >
            NUUL
          </div>
        </div>

        <div className="relative z-10 mt-2 flex h-[46vh] w-full max-w-4xl min-h-[280px] max-h-[420px] items-center justify-center">
          <div className="ring-shell relative h-full w-full">
            <div
              ref={ringRef}
              className={`filter-ring h-full w-full ${
                phase === "exit" ? "ring-exit" : phase === "cta" ? "ring-hidden" : "ring-focus"
              }`}
              style={ringStyle}
            >
            {filters.map((filter, index) => {
              const phi = Math.acos(-1 + (2 * index) / (filters.length - 1));
              const theta = Math.PI * (1 + Math.sqrt(5)) * index;
              const radius = 260;
              const x = Math.cos(theta) * Math.sin(phi) * radius;
              const y = Math.sin(theta) * Math.sin(phi) * (radius * 0.55);
              const z = Math.cos(phi) * radius;
              const scale = 0.7 + (z / radius + 1) * 0.2;
              return (
              <div
                key={filter.name}
                className="filter-card absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-3xl border border-white/15 bg-white/5 p-4 text-center backdrop-blur"
                style={{
                  ["--card-transform" as "--card-transform"]: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${theta * (180 / Math.PI)}deg) scale(${scale.toFixed(2)})`,
                  width: `${Math.round(filter.width * scale)}px`,
                  height: `${Math.round(filter.height * scale)}px`,
                  animationDelay: `${index * 0.22}s`,
                  ["--card-color" as "--card-color"]: filter.hue
                } as React.CSSProperties}
              >
                <div className="text-sm font-semibold">{filter.name}</div>
                <div className="mt-1 text-[0.65rem] text-white/60">{filter.note}</div>
                <div className="filter-sheen absolute inset-0 rounded-2xl" />
              </div>
            );
            })}
            </div>
          </div>
        </div>

        <div
          className={`relative z-10 mt-4 flex w-full flex-col items-center pb-20 text-center transition-all duration-700 ${
            phase === "cta" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div
            className={`mb-5 transition-all duration-700 ${
              phase === "cta" ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
            }`}
          >
            <div className="text-[0.65rem] uppercase tracking-[0.5em] text-white/60">NUUL STUDIO</div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] md:text-6xl">Safe Export</h1>
            <p className="mt-3 text-sm text-white/70 md:text-base">
              Local-first privacy for screenshots. Filters first, leaks last. No uploads. No accounts.
            </p>
            <div className="mt-2 text-[0.7rem] uppercase tracking-[0.4em] text-white/50">Set the mood</div>
          </div>
          <Link
            href="/studio?import=1"
            onMouseEnter={() => playHover()}
            className="rounded-2xl border border-white/30 bg-white/15 px-10 py-4 text-xs uppercase tracking-[0.3em] backdrop-blur transition hover:border-white/70"
          >
            Upload your image(s)
          </Link>
          <div className="mt-6 text-[0.65rem] uppercase tracking-[0.4em] text-white/50">
            Protect in style
          </div>
        </div>
      </section>
    </div>
  );
}
