import AnimatedOrb from "@/components/AnimatedOrb";

export default function GradientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <AnimatedOrb />
      <div className="mesh-animate absolute -top-24 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,_rgba(210,180,135,0.35),_transparent_70%)] opacity-70 blur-3xl" />
      <div className="mesh-animate absolute bottom-[-140px] left-8 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(140,120,90,0.3),_transparent_70%)] opacity-50 blur-[120px]" />
      <div className="mesh-animate absolute right-6 top-16 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(90,80,70,0.35),_transparent_70%)] opacity-50 blur-[110px]" />
    </div>
  );
}
