interface FindingCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  active?: boolean;
  onAction?: () => void;
}

export default function FindingCard({
  title,
  description,
  actionLabel,
  active,
  onAction
}: FindingCardProps) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-[color:var(--text)]">{title}</h4>
          <p className="mt-1 text-sm text-[color:var(--muted)]">{description}</p>
        </div>
        {actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            className={`rounded-full px-3 py-1 text-xs backdrop-blur ${
              active ? "border border-white/30 bg-white/20 text-[color:var(--text)]" : "bg-white/10 text-[color:var(--text)]"
            }`}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
