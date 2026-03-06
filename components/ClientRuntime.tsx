"use client";

import { useEffect } from "react";
import { installNetworkMonitor } from "@/lib/monitor/network";
import { applyTheme, loadTheme } from "@/lib/theme";
import NetworkOverlay from "@/components/NetworkOverlay";
import { OCRClient } from "@/lib/pipeline/ocr";
import { playChime } from "@/lib/sfx";

export default function ClientRuntime() {
  useEffect(() => {
    installNetworkMonitor();
    applyTheme(loadTheme());
    const ocrClient = new OCRClient();
    ocrClient
      .warmUp()
      .then(() => {
        (window as typeof window & { __nuulOcrReady?: boolean }).__nuulOcrReady = true;
      })
      .catch(() => {
        (window as typeof window & { __nuulOcrReady?: boolean }).__nuulOcrReady = false;
      })
      .finally(() => {
        (window as typeof window & { __nuulOcrWarm?: boolean }).__nuulOcrWarm = true;
      });
  }, []);

  useEffect(() => {
    const enabled = typeof window !== "undefined" && window.localStorage.getItem("nuul-sfx") === "true";
    if (!enabled) return;

    const handler = () => {
      playChime();
      window.removeEventListener("pointerdown", handler);
    };

    window.addEventListener("pointerdown", handler, { once: true });
    return () => window.removeEventListener("pointerdown", handler);
  }, []);

  return <NetworkOverlay />;
}
