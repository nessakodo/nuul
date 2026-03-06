export default function ManualTools() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Manual redaction</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <button className="rounded-full border border-white/10 bg-white/10 px-3 py-2">Brush blur</button>
        <button className="rounded-full border border-white/10 bg-white/10 px-3 py-2">Rect blur</button>
        <button className="rounded-full border border-white/10 bg-white/10 px-3 py-2">Auto apply</button>
      </div>
    </div>
  );
}
