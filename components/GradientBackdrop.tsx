import AnimatedOrb from "@/components/AnimatedOrb";

export default function GradientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <AnimatedOrb />
      <div className="mesh-animate absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_70%)] opacity-70 blur-3xl" />
      <div className="mesh-animate absolute bottom-[-120px] left-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(235,199,175,0.4),_transparent_70%)] opacity-60 blur-3xl" />
      <div className="mesh-animate absolute right-10 top-20 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,_rgba(180,196,230,0.45),_transparent_70%)] opacity-60 blur-3xl" />
    </div>
  );
}
