export default function BeforeAfterScrubber() {
  return (
    <div className="relative h-12 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
      <div className="absolute inset-y-0 left-0 w-1/2 bg-white/20" />
      <div className="absolute inset-y-0 left-1/2 w-[2px] bg-[color:var(--accent)]" />
      <div className="absolute inset-0 flex items-center justify-between px-4 text-xs text-[color:var(--muted)]">
        <span>Before</span>
        <span>After</span>
      </div>
    </div>
  );
}
