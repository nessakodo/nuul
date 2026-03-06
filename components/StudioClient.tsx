"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GlassPanel from "@/components/GlassPanel";
import PresetSelector from "@/components/PresetSelector";
import RiskMeter from "@/components/RiskMeter";
import FindingCard from "@/components/FindingCard";
import ExportSheet from "@/components/ExportSheet";
import BeforeAfterScrubber from "@/components/BeforeAfterScrubber";
import ManualTools from "@/components/ManualTools";
import { decodeImage, imageToCanvas } from "@/lib/pipeline/image";
import { scanImage } from "@/lib/pipeline/scan";
import { OCRClient } from "@/lib/pipeline/ocr";
import { exportSanitized } from "@/lib/pipeline/export";
import { createReceipt } from "@/lib/receipts/createReceipt";
import { FileInfo, RiskLevel, ScanFindings } from "@/lib/pipeline/types";
import exifr from "exifr";

const ocrClient = new OCRClient();

const presetOptions = {
  social: { maxEdge: 2048, addGrain: false },
  work: { maxEdge: 2048, addGrain: false },
  high: { maxEdge: 1600, addGrain: true }
} as const;

const receiptKey = "nuul-receipts";

type ExportFormat = "keep" | "image/jpeg" | "image/png" | "image/webp";
type ExportOutputFormat = "image/jpeg" | "image/png" | "image/webp";

export default function StudioClient() {
  const [preset, setPreset] = useState<RiskLevel>("work");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("keep");
  const [exportQuality, setExportQuality] = useState(0.92);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [findings, setFindings] = useState<ScanFindings | null>(null);
  const [processing, setProcessing] = useState(false);
  const [receiptJson, setReceiptJson] = useState<string | null>(null);
  const [autoCropEnabled, setAutoCropEnabled] = useState(false);
  const [verification, setVerification] = useState<{ metadataPresent: boolean } | null>(null);
  const [ocrAvailable, setOcrAvailable] = useState(true);
  const [showFilterOnboarding, setShowFilterOnboarding] = useState(false);
  const fileRef = useRef<File | null>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const analysisScaleRef = useRef<number>(1);

  const riskLevel = useMemo<RiskLevel>(() => {
    if (!findings) return "social";
    if (findings.faces.length || findings.textLeaks.length > 3) return "high";
    if (findings.textLeaks.length || findings.codes.length || findings.metadata.exifPresent) return "work";
    return "social";
  }, [findings]);

  const textLeakSummary = useMemo(() => {
    if (!findings) return null;
    const high = findings.textLeaks.filter((leak) => leak.confidence === "high").length;
    const medium = findings.textLeaks.filter((leak) => leak.confidence === "medium").length;
    const low = findings.textLeaks.filter((leak) => leak.confidence === "low").length;
    return { high, medium, low };
  }, [findings]);

  const handleFile = useCallback(
    async (file: File) => {
      setProcessing(true);
      setAutoCropEnabled(false);
      setReceiptJson(null);
      setVerification(null);
      fileRef.current = file;
      if (previewUrl) URL.revokeObjectURL(previewUrl);

      const bitmap = await decodeImage(file);
      bitmapRef.current = bitmap;
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const { canvas, ctx, width, height, scale } = imageToCanvas(bitmap, 1400);
      analysisScaleRef.current = scale;
      const imageData = ctx.getImageData(0, 0, width, height);
      const ocrReady =
        typeof window !== "undefined" &&
        (window as typeof window & { __nuulOcrReady?: boolean }).__nuulOcrReady;
      setOcrAvailable(ocrReady !== false);
      const ocrText = ocrReady ? await ocrClient.recognize(imageData) : "";

      const scan = await scanImage(file, imageData, ocrText);

      setFindings(scan);
      setFileInfo({
        name: file.name,
        type: file.type,
        size: file.size,
        width: bitmap.width,
        height: bitmap.height
      });
      setProcessing(false);
    },
    [previewUrl]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem("nuul-mobile-filters") === "true";
    const isMobile = window.innerWidth < 900;
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (mode === "filters") {
      setShowFilterOnboarding(true);
      return;
    }
    if (!seen && isMobile) setShowFilterOnboarding(true);
  }, []);

  const onDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const onPaste = (event: React.ClipboardEvent<HTMLButtonElement>) => {
    const items = event.clipboardData.files;
    const file = items?.[0];
    if (file) void handleFile(file);
  };

  const onPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const onExport = async () => {
    if (!bitmapRef.current || !fileInfo || !findings) return;
    setProcessing(true);
    const options = presetOptions[preset];
    const formatToUse = exportFormat === "keep" ? (fileInfo.type as ExportOutputFormat) : exportFormat;
    const resolvedFormat: ExportOutputFormat =
      formatToUse === "image/jpeg" || formatToUse === "image/webp" || formatToUse === "image/png"
        ? formatToUse
        : "image/png";
    const analysisScale = analysisScaleRef.current || 1;
    const blurRegions = findings.codes.map((code) => ({
      ...code,
      boundingBox: {
        x: code.boundingBox.x / analysisScale,
        y: code.boundingBox.y / analysisScale,
        width: code.boundingBox.width / analysisScale,
        height: code.boundingBox.height / analysisScale
      }
    }));
    const cropTop = autoCropEnabled && findings.topBarHeight ? findings.topBarHeight / analysisScale : 0;

    const output = await exportSanitized(bitmapRef.current, {
      format: resolvedFormat,
      maxEdge: options.maxEdge,
      blurRegions,
      addGrain: options.addGrain,
      quality: resolvedFormat === "image/png" ? undefined : exportQuality,
      cropTop
    });

    const exportFile: FileInfo = {
      name: `nuul-${Math.random().toString(36).slice(2, 8)}-${Date.now()}`,
      type: output.type,
      size: output.blob.size,
      width: output.width,
      height: output.height
    };

    const highConfidenceFindings = findings.textLeaks.filter((leak) => leak.confidence === "high");
    const lowConfidenceFindings = findings.textLeaks.filter((leak) => leak.confidence !== "high");
    const receipt = createReceipt({
      original: fileInfo,
      exported: exportFile,
      found: [
        ...(findings.metadata.exifPresent ? [{ label: "Metadata detected" }] : []),
        ...highConfidenceFindings.map((leak) => ({ label: `${leak.type} detected` })),
        ...lowConfidenceFindings.map((leak) => ({
          label: leak.type === "address" ? "Possible address" : `Possible ${leak.type}`
        })),
        ...(findings.codes.length ? [{ label: "QR code detected" }] : []),
        ...(findings.faces.length ? [{ label: "Face detected" }] : []),
        ...(findings.screenHints.length ? [{ label: "Browser UI detected" }] : [])
      ],
      changed: [
        { label: "Metadata removed" },
        { label: "Re-encoded" },
        ...(blurRegions.length ? [{ label: "QR blurred", detail: `${blurRegions.length}` }] : []),
        ...(cropTop ? [{ label: "Auto-cropped browser chrome" }] : [])
      ],
      remaining: [
        ...(findings.faces.length ? [{ label: "Faces remain visible" }] : []),
        ...(findings.screenHints.length ? [{ label: "Tabs or URL may still be visible" }] : []),
        ...(findings.textLeaks.some((leak) => leak.confidence !== "high")
          ? [{ label: "Possible low-confidence text remains" }]
          : [])
      ],
      tips: ["Review the export before sharing.", "Tabs or URL may still be visible."]
    });

    const receiptString = JSON.stringify(receipt, null, 2);
    setReceiptJson(receiptString);

    if (typeof window !== "undefined") {
      const existing = JSON.parse(window.localStorage.getItem(receiptKey) ?? "[]") as string[];
      window.localStorage.setItem(receiptKey, JSON.stringify([receiptString, ...existing].slice(0, 25)));
    }

    downloadBlob(output.blob, `${exportFile.name}.${output.type.split("/")[1]}`);
    downloadBlob(new Blob([receiptString], { type: "application/json" }), `${exportFile.name}.receipt.json`);

    try {
      const verified = await exifr.parse(output.blob);
      setVerification({ metadataPresent: !!verified });
    } catch {
      setVerification({ metadataPresent: false });
    }

    setProcessing(false);
  };

  const onExportAsIs = async () => {
    if (!bitmapRef.current || !fileInfo) return;
    setProcessing(true);
    const formatToUse = exportFormat === "keep" ? (fileInfo.type as ExportOutputFormat) : exportFormat;
    const resolvedFormat: ExportOutputFormat =
      formatToUse === "image/jpeg" || formatToUse === "image/webp" || formatToUse === "image/png"
        ? formatToUse
        : "image/png";
    const output = await exportSanitized(bitmapRef.current, {
      format: resolvedFormat,
      quality: resolvedFormat === "image/png" ? undefined : exportQuality
    });

    const exportFile: FileInfo = {
      name: `nuul-${Math.random().toString(36).slice(2, 8)}-${Date.now()}`,
      type: output.type,
      size: output.blob.size,
      width: output.width,
      height: output.height
    };

    const receipt = createReceipt({
      original: fileInfo,
      exported: exportFile,
      found: findings
        ? [
            ...(findings.metadata.exifPresent ? [{ label: "Metadata detected" }] : []),
            ...(findings.codes.length ? [{ label: "QR code detected" }] : []),
            ...(findings.faces.length ? [{ label: "Face detected" }] : []),
            ...(findings.textLeaks.length ? [{ label: "Text leaks detected" }] : [])
          ]
        : [],
      changed: [{ label: "Re-encoded" }],
      remaining: [
        { label: "No redactions applied" },
        ...(findings?.faces.length ? [{ label: "Faces remain visible" }] : [])
      ],
      tips: ["Review the export before sharing."]
    });

    const receiptString = JSON.stringify(receipt, null, 2);
    setReceiptJson(receiptString);

    downloadBlob(output.blob, `${exportFile.name}.${output.type.split("/")[1]}`);
    downloadBlob(new Blob([receiptString], { type: "application/json" }), `${exportFile.name}.receipt.json`);

    try {
      const verified = await exifr.parse(output.blob);
      setVerification({ metadataPresent: !!verified });
    } catch {
      setVerification({ metadataPresent: false });
    }

    setProcessing(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_320px]">
      {showFilterOnboarding ? (
        <div className="fixed inset-0 z-[70] flex items-end bg-black/60 lg:hidden">
          <div className="w-full rounded-t-3xl border border-white/10 bg-white/10 p-6 text-white backdrop-blur">
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">Filters first</div>
            <div className="mt-2 text-xl font-semibold">Pick a look before you edit</div>
            <p className="mt-2 text-sm text-white/60">
              Import a Lightroom preset or choose a mood. We’ll apply it before sanitization.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {["Graphite", "Warm Film", "Soft Grain", "Noir"].map((label) => (
                <button key={label} className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-left">
                  {label}
                </button>
              ))}
              <label className="col-span-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-left">
                Import Lightroom preset (.xmp)
                <input type="file" className="hidden" accept=".xmp" />
              </label>
            </div>
            <button
              className="mt-5 w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm"
              onClick={() => {
                window.localStorage.setItem("nuul-mobile-filters", "true");
                setShowFilterOnboarding(false);
              }}
            >
              Continue to Studio
            </button>
          </div>
        </div>
      ) : null}
      <GlassPanel className="p-5">
        <div className="space-y-6">
          <div className="order-3 lg:order-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Import</div>
            <div className="mt-3 flex flex-col gap-3">
              <button
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-6 text-left text-sm backdrop-blur"
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                Drag & drop
                <div className="mt-1 text-xs text-[color:var(--muted)]">Photos, screenshots, JPG/PNG/WEBP</div>
              </button>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-2"
                  onPaste={onPaste}
                >
                  Paste
                </button>
                <label className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-center">
                  Pick file
                  <input type="file" className="hidden" onChange={onPick} accept="image/*" />
                </label>
              </div>
            </div>
          </div>

          <div className="order-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Presets</div>
            <div className="mt-3">
              <PresetSelector current={preset} onChange={setPreset} />
            </div>
          </div>

          <div className="order-2 lg:order-2 lg:hidden">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-xs text-[color:var(--muted)]">
              Start with a filter or preset. Import a Lightroom preset for quick styling.
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Filters</div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {["Graphite", "Warm Film", "Soft Grain", "Noir"].map((label) => (
                <button
                  key={label}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-left"
                >
                  {label}
                </button>
              ))}
              <label className="col-span-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-left">
                Import Lightroom preset (.xmp)
                <input type="file" className="hidden" accept=".xmp" />
              </label>
              <label className="col-span-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-left">
                Import LUT (.cube)
                <input type="file" className="hidden" accept=".cube" />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-xs text-[color:var(--muted)]">
            {fileInfo ? (
              <div className="space-y-2">
                <div>Format: {fileInfo.type || "unknown"}</div>
                <div>Size: {(fileInfo.size / 1024 / 1024).toFixed(2)} MB</div>
                <div>
                  Dimensions: {fileInfo.width} x {fileInfo.height}
                </div>
                <div>Location metadata present: {findings?.metadata.gpsPresent ? "Yes" : "No"}</div>
              </div>
            ) : (
              "File info will appear here once imported. Location metadata details are hidden by default."
            )}
          </div>
        </div>
      </GlassPanel>

      <GlassPanel className="p-6">
        <div className="flex h-full flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Safe Export for Screenshots</h1>
              <p className="text-sm text-[color:var(--muted)]">
                Local-only scan for API keys, QR codes, emails, addresses, tabs, and browser chrome.
              </p>
            </div>
            <button className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-[color:var(--muted)]">
              Developer mode
            </button>
          </div>

          <div className="flex-1 rounded-3xl border border-dashed border-white/20 bg-white/5 p-4">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full w-full rounded-2xl object-contain" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-sm text-[color:var(--muted)]">
                <div className="h-24 w-24 rounded-2xl border border-white/10 bg-white/10" />
                Drop a file to preview and edit
              </div>
            )}
          </div>

          <BeforeAfterScrubber />
          <ManualTools />
          {verification ? (
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-xs text-[color:var(--muted)]">
              Sanitization verified. Metadata present: {verification.metadataPresent ? "Yes" : "No"}.
            </div>
          ) : null}
          {receiptJson ? (
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-xs text-[color:var(--muted)]">
              Receipt downloaded. Check your downloads for JSON.
            </div>
          ) : null}
        </div>
      </GlassPanel>

      <div className="space-y-6">
        <GlassPanel className="p-5">
          <RiskMeter level={riskLevel} />
          <div className="mt-6 space-y-3">
            <FindingCard
              title="Metadata"
              description={
                findings?.metadata.exifPresent
                  ? "EXIF present. Will be removed on export."
                  : "No EXIF detected."
              }
              actionLabel={findings?.metadata.exifPresent ? "Remove" : undefined}
              active={!!findings?.metadata.exifPresent}
            />
            <FindingCard
              title="Text leaks"
              description={
                findings
                  ? `High ${textLeakSummary?.high ?? 0}, medium ${textLeakSummary?.medium ?? 0}, low ${textLeakSummary?.low ?? 0}. Medium/low are suggestions.`
                  : ocrAvailable
                    ? "Scan to find text leaks."
                    : "OCR unavailable. Add local Tesseract assets to enable text detection."
              }
              actionLabel={findings?.textLeaks.length ? "Review" : undefined}
            />
            <FindingCard
              title="Screens and chrome"
              description={
                findings?.screenHints.length
                  ? findings.screenHints.join(" ")
                  : "Heuristics will note tabs or browser chrome."
              }
              actionLabel={findings?.chromeConfidence === "high" ? "Auto crop" : undefined}
              active={autoCropEnabled}
              onAction={() => setAutoCropEnabled((prev) => !prev)}
            />
            <FindingCard
              title="QR codes"
              description={findings ? `${findings.codes.length} QR codes found.` : "Scan to detect QR codes."}
              actionLabel={findings?.codes.length ? "Blur" : undefined}
              active={!!findings?.codes.length}
            />
            <FindingCard
              title="Faces"
              description={findings ? `${findings.faces.length} faces detected.` : "Face detection pending."}
            />
          </div>
        </GlassPanel>

        <ExportSheet
          format={exportFormat}
          quality={exportQuality}
          onFormatChange={setExportFormat}
          onQualityChange={setExportQuality}
          onExport={onExport}
          onExportAsIs={onExportAsIs}
        />
        <GlassPanel className="p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Signal panel</div>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[color:var(--muted)]">
            Chic exports, minimal risk. Filter first on mobile, then sanitize with confidence. Built to feel like a
            studio, not a security tool.
          </div>
        </GlassPanel>
        {processing ? (
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-xs text-[color:var(--muted)]">
            Processing…
          </div>
        ) : null}
      </div>
    </div>
  );
}
