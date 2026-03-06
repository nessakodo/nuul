interface ExportSheetProps {
  format: "keep" | "image/jpeg" | "image/png" | "image/webp";
  quality: number;
  onFormatChange: (value: "keep" | "image/jpeg" | "image/png" | "image/webp") => void;
  onQualityChange: (value: number) => void;
  onExport?: () => void;
  onExportAsIs?: () => void;
}

export default function ExportSheet({
  format,
  quality,
  onFormatChange,
  onQualityChange,
  onExport,
  onExportAsIs
}: ExportSheetProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/10 p-4">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Export</div>
        <h3 className="mt-1 text-lg font-semibold">Sanitized export</h3>
      </div>

      <div className="space-y-3 text-xs text-[color:var(--muted)]">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2">Format</div>
          <div className="flex gap-2">
            {[
              { label: "Keep", value: "keep" },
              { label: "JPG", value: "image/jpeg" },
              { label: "PNG", value: "image/png" },
              { label: "WEBP", value: "image/webp" }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onFormatChange(option.value as ExportSheetProps["format"])}
                className={`rounded-full px-3 py-1 ${
                  format === option.value ? "bg-white/30" : "bg-white/10"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2">Quality</div>
          <input
            type="range"
            min={0.6}
            max={0.98}
            step={0.02}
            value={quality}
            onChange={(event) => onQualityChange(Number(event.target.value))}
            className="w-full"
            aria-label="Export quality"
          />
          <div className="mt-1 text-xs">{Math.round(quality * 100)}%</div>
        </div>
      </div>

      <div className="grid gap-2">
        <button
          type="button"
          onClick={onExport}
          className="w-full rounded-full bg-[color:var(--accent)] px-4 py-3 text-sm font-semibold text-black"
        >
          Safe Export
        </button>
        <button
          type="button"
          onClick={onExportAsIs}
          className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-[color:var(--text)]"
        >
          Export As Is
        </button>
      </div>
      <p className="text-xs text-[color:var(--muted)]">
        This reduces common leaks. It cannot guarantee anonymity against determined adversaries.
      </p>
    </div>
  );
}
