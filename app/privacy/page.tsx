import AppShell from "@/components/AppShell";
import GradientBackdrop from "@/components/GradientBackdrop";
import GlassPanel from "@/components/GlassPanel";

export default function PrivacyPage() {
  return (
    <AppShell>
      <GradientBackdrop />
      <GlassPanel className="p-8">
        <h1 className="text-2xl font-semibold">Privacy</h1>
        <p className="mt-4 text-sm text-[color:var(--muted)]">
          NUUL processes files on your device only. There are no uploads, no accounts, and no third-party analytics by
          default. Files never leave your browser unless you export them.
        </p>
        <div className="mt-6 space-y-4 text-sm text-[color:var(--muted)]">
          <p>We do not collect or store your images. Receipt Vault is optional and stores only receipt data locally.</p>
          <p>
            Any network requests should be limited to loading the application assets. You can enable developer mode in
            settings to confirm zero requests during processing.
          </p>
        </div>
      </GlassPanel>
    </AppShell>
  );
}
