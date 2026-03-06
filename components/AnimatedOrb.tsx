"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";

export default function AnimatedOrb() {
  const orbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!orbRef.current) return;
    const animation = anime({
      targets: orbRef.current,
      translateX: ["-12%", "12%"],
      translateY: ["-8%", "10%"],
      scale: [1, 1.08],
      easing: "easeInOutSine",
      direction: "alternate",
      duration: 16000,
      loop: true
    });

    const handler = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 30;
      const y = (event.clientY / window.innerHeight - 0.5) * 30;
      orbRef.current?.style.setProperty("--orb-tilt-x", `${x}px`);
      orbRef.current?.style.setProperty("--orb-tilt-y", `${y}px`);
    };

    window.addEventListener("mousemove", handler);

    return () => {
      window.removeEventListener("mousemove", handler);
      animation.pause();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        ref={orbRef}
        className="orb absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ transform: "translate(-50%, -50%) translate(var(--orb-tilt-x, 0px), var(--orb-tilt-y, 0px))" }}
      />
    </div>
  );
}
