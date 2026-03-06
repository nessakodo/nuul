"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import GradientBackdrop from "@/components/GradientBackdrop";
import GlassPanel from "@/components/GlassPanel";
import { applyTheme, loadTheme, saveTheme, ThemeMode } from "@/lib/theme";
import { getNetworkCount } from "@/lib/monitor/network";

export default function SettingsPage() {
  const [theme, setTheme] = useState<ThemeMode>("warm");
  const [vaultEnabled, setVaultEnabled] = useState(false);
  const [networkCount, setNetworkCount] = useState(0);
  const [overlayEnabled, setOverlayEnabled] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(false);
  const [enhancedEnabled, setEnhancedEnabled] = useState(false);

  useEffect(() => {
    const loaded = loadTheme();
    setTheme(loaded);
    applyTheme(loaded);
  }, []);

  useEffect(() => {
    setOverlayEnabled(window.localStorage.getItem("nuul-dev-overlay") === "true");
    setSfxEnabled(window.localStorage.getItem("nuul-sfx") === "true");
    setEnhancedEnabled(window.localStorage.getItem("nuul-enhanced") === "true");
    const timer = window.setInterval(() => {
      setNetworkCount(getNetworkCount());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const handleTheme = (value: ThemeMode) => {
    setTheme(value);
    applyTheme(value);
    saveTheme(value);
  };

  return (
    <AppShell>
      <GradientBackdrop />
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="p-6">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Local-only preferences. No accounts, no remote storage.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Theme</div>
              <div className="mt-3 flex gap-2">
                <button
                  className={`rounded-full px-4 py-2 text-xs ${
                    theme === "warm" ? "bg-white/30" : "bg-white/10"
                  }`}
                  onClick={() => handleTheme("warm")}
                >
                  Warm neutral
                </button>
                <button
                  className={`rounded-full px-4 py-2 text-xs ${
                    theme === "dreamy" ? "bg-white/30" : "bg-white/10"
                  }`}
                  onClick={() => handleTheme("dreamy")}
                >
                  Dreamy dark
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Receipt Vault</div>
                  <div className="text-xs text-[color:var(--muted)]">
                    Save receipts locally in IndexedDB for quick access.
                  </div>
                </div>
                <button
                  className={`rounded-full px-4 py-2 text-xs ${
                    vaultEnabled ? "bg-[color:var(--accent)] text-black" : "bg-white/10"
                  }`}
                  onClick={() => setVaultEnabled((prev) => !prev)}
                >
                  {vaultEnabled ? "Enabled" : "Disabled"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Sound FX</div>
                  <div className="text-xs text-[color:var(--muted)]">
                    Subtle chime on first interaction. Never recorded.
                  </div>
                </div>
                <button
                  className={`rounded-full px-4 py-2 text-xs ${
                    sfxEnabled ? "bg-[color:var(--accent)] text-black" : "bg-white/10"
                  }`}
                  onClick={() => {
                    const next = !sfxEnabled;
                    setSfxEnabled(next);
                    window.localStorage.setItem("nuul-sfx", String(next));
                  }}
                >
                  {sfxEnabled ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Network Monitor Overlay</div>
                  <div className="text-xs text-[color:var(--muted)]">
                    Shows request count after app load. Processing should add zero requests.
                  </div>
                </div>
                <button
                  className={`rounded-full px-4 py-2 text-xs ${
                    overlayEnabled ? "bg-[color:var(--accent)] text-black" : "bg-white/10"
                  }`}
                  onClick={() => {
                    const next = !overlayEnabled;
                    setOverlayEnabled(next);
                    window.localStorage.setItem("nuul-dev-overlay", String(next));
                  }}
                >
                  {overlayEnabled ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Enhanced tools</div>
                  <div className="text-xs text-[color:var(--muted)]">
                    Unlock the advanced studio with detectors and manual tools.
                  </div>
                </div>
                <button
                  className={`rounded-full px-4 py-2 text-xs ${
                    enhancedEnabled ? "bg-[color:var(--accent)] text-black" : "bg-white/10"
                  }`}
                  onClick={() => {
                    const next = !enhancedEnabled;
                    setEnhancedEnabled(next);
                    window.localStorage.setItem("nuul-enhanced", String(next));
                  }}
                >
                  {enhancedEnabled ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="text-xl font-semibold">Developer mode</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            Verify local-only processing by monitoring network requests in-session. NUUL should show zero requests after
            the initial app load.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4 text-xs text-[color:var(--muted)]">
            Network requests: {networkCount}
          </div>
        </GlassPanel>
      </div>
    </AppShell>
  );
}
