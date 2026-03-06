"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import anime from "animejs";
import GradientBackdrop from "@/components/GradientBackdrop";
import { playHover, playReveal, startDrone } from "@/lib/sfx";

const filters = [
  { name: "Graphite", note: "Matte blacks, clean UI", className: "from-[#0d0d10] via-[#1a1a22] to-[#2b2b35]" },
  { name: "Warm Film", note: "Soft amber shadows", className: "from-[#1a1210] via-[#3a2b22] to-[#5c4634]" },
  { name: "Soft Grain", note: "Muted highlights", className: "from-[#121318] via-[#2a2c33] to-[#3b3e49]" },
  { name: "Noir", note: "High contrast grit", className: "from-[#0b0b0d] via-[#1c1f24] to-[#2a2e37]" },
  { name: "Studio", note: "Muted neutrals", className: "from-[#141115] via-[#2d2424] to-[#3a3130]" },
  { name: "Chrome", note: "Cold clean edges", className: "from-[#0c1216] via-[#202830] to-[#3a424c]" },
  { name: "Dusk", note: "Blue hour haze", className: "from-[#111018] via-[#2a2434] to-[#443b4f]" },
  { name: "Ritual", note: "Gold undertones", className: "from-[#1a1311] via-[#3d2f24] to-[#6a503b]" }
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const handler = () => {
      startDrone();
      window.removeEventListener("pointerdown", handler);
    };
    window.addEventListener("pointerdown", handler, { once: true });
    return () => window.removeEventListener("pointerdown", handler);
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    anime({
      targets: heroRef.current.querySelectorAll(".hero-reveal"),
      translateY: [18, 0],
      opacity: [0, 1],
      delay: anime.stagger(120),
      duration: 900,
      easing: "easeOutCubic"
    });
  }, []);

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

    const particles = Array.from({ length: 160 }, () => ({
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
      particles.forEach((p) => {
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

  const handleScroll = useCallback(() => {
    document.getElementById("filters")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="relative min-h-screen">
      <GradientBackdrop />
      <nav className="relative z-20 mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-6 pt-8 md:grid-cols-[1fr_auto_1fr]">
        <div className="text-center text-lg font-semibold tracking-[0.3em] text-white md:text-left">NUUL</div>
        <div className="flex justify-center">
          <div className="flex gap-2 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-xs text-white/70 backdrop-blur">
            <Link className="rounded-full px-4 py-1 hover:text-white" href="/studio">
              Studio
            </Link>
            <Link className="rounded-full px-4 py-1 hover:text-white" href="/receipts">
              Receipts
            </Link>
            <Link className="rounded-full px-4 py-1 hover:text-white" href="/settings">
              Settings
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.2em] text-white/50 md:justify-end">
          <Link href="/privacy">Privacy</Link>
          <Link href="/threat-model">Threat model</Link>
        </div>
      </nav>
      <section
        ref={heroRef}
        className="relative flex min-h-[96vh] flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-10 text-center text-white"
      >
        <div className="pointer-events-none absolute inset-0">
          <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
          <div className="scanline-layer absolute inset-0 opacity-30" />
          <div className="orb absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="hero-reveal text-[0.65rem] uppercase tracking-[0.5em] text-white/60">NUUL STUDIO</div>
          <h1 className="hero-reveal mt-5 text-5xl font-semibold tracking-[-0.03em] md:text-6xl">
            Safe Export
          </h1>
          <p className="hero-reveal mt-4 text-sm text-white/70 md:text-base">
            Local-first privacy for screenshots. Filters first, leaks last. No uploads. No accounts.
          </p>

          <div className="hero-reveal mt-10 grid gap-3">
            <button
              onClick={() => {
                playReveal();
                handleScroll();
              }}
              onMouseEnter={() => playHover()}
              className="rounded-2xl border border-white/30 bg-white/15 px-6 py-3 text-xs uppercase tracking-[0.2em] backdrop-blur transition hover:border-white/60"
            >
              Start with filters
            </button>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/studio?import=1"
                onClick={() => playReveal()}
                onMouseEnter={() => playHover()}
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur transition hover:border-white/50"
              >
                Safe export
              </Link>
              <Link
                href="/studio"
                onClick={() => playReveal()}
                onMouseEnter={() => playHover()}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.2em] text-white/60 backdrop-blur transition hover:border-white/40"
              >
                Advanced studio
              </Link>
            </div>
            <Link
              href="/receipts"
              onClick={() => playReveal()}
              onMouseEnter={() => playHover()}
              className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50"
            >
              Explore receipts
            </Link>
          </div>
        </div>

        <div className="hero-reveal mt-12 text-[0.65rem] uppercase tracking-[0.4em] text-white/40">
          Scroll for filters
        </div>
      </section>

      <section id="filters" className="relative z-10 px-6 pb-20 pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 text-white">
            <div className="text-[0.65rem] uppercase tracking-[0.4em] text-white/50">Filter first</div>
            <h2 className="text-3xl font-semibold tracking-[-0.02em]">Pick a look before you protect.</h2>
            <p className="text-sm text-white/60 md:max-w-2xl">
              NUUL blends cinematic presets with safe export. Choose a mood, then we redact sensitive leaks in the
              background. The result feels intentional, not technical.
            </p>
          </div>

          <div className="mt-10 columns-2 gap-4 space-y-4 md:columns-3 lg:columns-4">
            {filters.map((filter, index) => (
              <div
                key={filter.name}
                className={`relative break-inside-avoid overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${filter.className} p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]`}
                style={{ height: `${220 + (index % 3) * 60}px` }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_55%)]" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-end text-white">
                  <div className="text-sm font-semibold">{filter.name}</div>
                  <div className="text-xs text-white/60">{filter.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="text-[0.6rem] uppercase tracking-[0.35em] text-white/50">Designed to protect in style</div>
              <h3 className="mt-3 text-2xl font-semibold">Upload your screenshot. We’ll keep the story, drop the leaks.</h3>
              <p className="mt-3 text-sm text-white/60">
                NUUL scans for API keys, emails, QR codes, browser tabs, and metadata before you share. Everything stays
                on device.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Link
                href="/studio?import=1"
                onClick={() => playReveal()}
                onMouseEnter={() => playHover()}
                className="glow-cta rounded-full border border-white/20 bg-white/15 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white backdrop-blur transition hover:border-white/50"
              >
                Upload your own
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
