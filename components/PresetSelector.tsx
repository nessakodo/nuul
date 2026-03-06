interface PresetSelectorProps {
  current: "social" | "work" | "high";
  onChange?: (value: "social" | "work" | "high") => void;
}

const presets = [
  { value: "social", label: "Social safe", detail: "Strip metadata, gentle resize" },
  { value: "work", label: "Work safe", detail: "OCR & QR blur, suggested cleanups" },
  { value: "high", label: "Sensitive", detail: "Strong blur + noise" }
] as const;

export default function PresetSelector({ current, onChange }: PresetSelectorProps) {
  return (
    <div className="space-y-3">
      {presets.map((preset) => (
        <button
          key={preset.value}
          type="button"
          onClick={() => onChange?.(preset.value)}
          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
            current === preset.value
              ? "border-white/40 bg-white/20"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          }`}
        >
          <div>
            <div className="text-sm font-semibold text-[color:var(--text)]">{preset.label}</div>
            <div className="text-xs text-[color:var(--muted)]">{preset.detail}</div>
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            {current === preset.value ? "Selected" : "Choose"}
          </div>
        </button>
      ))}
    </div>
  );
}
