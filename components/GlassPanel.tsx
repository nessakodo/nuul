import { ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export default function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div className={`glass rounded-3xl border border-white/10 ${className ?? ""}`}>
      {children}
    </div>
  );
}
