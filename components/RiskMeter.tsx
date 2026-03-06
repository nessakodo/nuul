interface RiskMeterProps {
  level: "social" | "work" | "high";
}

const levels = {
  social: { label: "Social safe", width: "35%" },
  work: { label: "Work safe", width: "65%" },
  high: { label: "Sensitive", width: "90%" }
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
        <div
          className="h-full"
          style={{
            width: current.width,
            background: "linear-gradient(90deg, rgba(201,162,107,0.25), rgba(201,162,107,0.7))"
          }}
        />
      </div>
    </div>
  );
}
