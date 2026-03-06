import AppShell from "@/components/AppShell";
import GradientBackdrop from "@/components/GradientBackdrop";
import GlassPanel from "@/components/GlassPanel";

export default function ThreatModelPage() {
  return (
    <AppShell>
      <GradientBackdrop />
      <GlassPanel className="p-8">
        <h1 className="text-2xl font-semibold">Threat model</h1>
        <p className="mt-4 text-sm text-[color:var(--muted)]">
          NUUL reduces common leaks in screenshots and photos. It is designed to lower risk when sharing, not guarantee
          anonymity against determined adversaries.
        </p>
        <div className="mt-6 space-y-4 text-sm text-[color:var(--muted)]">
          <p>
            NUUL helps remove metadata, blur detected text leaks, faces, and codes. It cannot prevent correlation from
            context, unique scene content, or outside datasets. Always review your export before sharing.
          </p>
          <p>
            If you need strong anonymity, consider additional operational security practices beyond sanitizing an image.
          </p>
        </div>
      </GlassPanel>
    </AppShell>
  );
}
