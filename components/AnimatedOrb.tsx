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

    return () => animation.pause();
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        ref={orbRef}
        className="orb absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      />
    </div>
  );
}
