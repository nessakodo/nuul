interface RiskMeterProps {
  level: "social" | "work" | "high";
}

const levels = {
  social: { label: "Social safe", color: "bg-emerald-400/70" },
  work: { label: "Work safe", color: "bg-amber-300/70" },
  high: { label: "Sensitive", color: "bg-rose-400/70" }
};

export default function RiskMeter({ level }: RiskMeterProps) {
  const current = levels[level];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-[color:var(--muted)]">
        <span>Safety Summary</span>
        <span>{current.label}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div className={`h-full ${current.color}`} style={{ width: level === "social" ? "35%" : level === "work" ? "65%" : "90%" }} />
      </div>
    </div>
  );
}
