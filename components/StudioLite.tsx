"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GlassPanel from "@/components/GlassPanel";
import { decodeImage, imageToCanvas } from "@/lib/pipeline/image";
import { scanImage } from "@/lib/pipeline/scan";
import { OCRClient } from "@/lib/pipeline/ocr";
import { exportSanitized } from "@/lib/pipeline/export";
import { createReceipt } from "@/lib/receipts/createReceipt";
import { FileInfo, ScanFindings } from "@/lib/pipeline/types";

const ocrClient = new OCRClient();
const receiptKey = "nuul-receipts";

const presets = [
  { id: "graphite", label: "Graphite" },
  { id: "warm", label: "Warm Film" },
  { id: "noir", label: "Noir" },
  { id: "studio", label: "Studio" }
];

function downloadBlob(blob: Blob, name: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
}

export default function StudioLite() {
  const [preset, setPreset] = useState("graphite");
  const [queue, setQueue] = useState<File[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [processing, setProcessing] = useState(false);
  const [findings, setFindings] = useState<ScanFindings | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);

  const currentFile = queue[currentIndex] ?? null;

  const loadFile = useCallback(
    async (file: File) => {
      setProcessing(true);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const bitmap = await decodeImage(file);
      bitmapRef.current = bitmap;
      setPreviewUrl(URL.createObjectURL(file));
      const { canvas, ctx, width, height, scale } = imageToCanvas(bitmap, 1400);
      const imageData = ctx.getImageData(0, 0, width, height);
      const ocrText = await ocrClient.recognize(imageData);
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
    if (currentFile) void loadFile(currentFile);
  }, [currentFile, loadFile]);

  const onPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    setQueue(files);
    setCurrentIndex(0);
  };

  const exportOne = async (file: File, index: number) => {
    const bitmap = bitmapRef.current ?? (await decodeImage(file));
    const output = await exportSanitized(bitmap, {
      format: file.type === "image/png" ? "image/png" : "image/jpeg",
      quality: 0.92,
      maxEdge: 2048,
      blurRegions: findings?.codes.filter((code) => code.autoApply) ?? [],
      cropTop: findings?.chromeConfidence === "high" ? findings?.topBarHeight ?? 0 : 0
    });

    const exportName = `nuul_${Date.now()}_${index + 1}.${output.type.split("/")[1]}`;
    downloadBlob(output.blob, exportName);

    if (fileInfo) {
      const receipt = createReceipt({
        original: fileInfo,
        exported: {
          name: exportName,
          type: output.type,
          size: output.blob.size,
          width: output.width,
          height: output.height
        },
        found: [
          ...(findings?.codes.length ? [{ label: "QR codes detected" }] : []),
          ...(findings?.textLeaks.length ? [{ label: "Text leaks detected" }] : [])
        ],
        changed: [
          { label: "Metadata removed" },
          { label: "Re-encoded" },
          ...(findings?.codes.length ? [{ label: "QR blur applied" }] : []),
          ...(findings?.chromeConfidence === "high" ? [{ label: "Top bar cropped" }] : [])
        ],
        remaining: [
          ...(findings?.faces.length ? [{ label: "Faces remain visible" }] : []),
          ...(findings?.textLeaks.length ? [{ label: "Text leaks not auto-blurred" }] : [])
        ],
        tips: ["Review before sharing."]
      });
      const stored = JSON.parse(window.localStorage.getItem(receiptKey) ?? "[]") as string[];
      stored.unshift(JSON.stringify(receipt));
      window.localStorage.setItem(receiptKey, JSON.stringify(stored.slice(0, 24)));
    }
  };

  const handleExport = async () => {
    if (!currentFile) return;
    setProcessing(true);
    await exportOne(currentFile, currentIndex);
    setProcessing(false);
  };

  const handleExportAll = async () => {
    if (!queue.length) return;
    setProcessing(true);
    for (let i = 0; i < queue.length; i += 1) {
      await exportOne(queue[i], i);
    }
    setProcessing(false);
  };

  const leakSummary = useMemo(() => {
    if (!findings) return "No scan yet.";
    const qr = findings.codes.length ? `${findings.codes.length} QR` : "";
    const text = findings.textLeaks.length ? `${findings.textLeaks.length} text leaks` : "";
    const chrome = findings.chromeConfidence === "high" ? "Browser chrome" : "";
    return [qr, text, chrome].filter(Boolean).join(" · ") || "No obvious leaks.";
  }, [findings]);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr_320px]">
      <GlassPanel className="p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Upload</div>
        <div className="mt-4 space-y-3">
          <button
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-6 text-left text-sm backdrop-blur"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload image(s)
            <div className="mt-1 text-xs text-[color:var(--muted)]">JPG, PNG, WEBP · Batch supported</div>
          </button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={onPick} accept="image/*" multiple />
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-[color:var(--muted)]">
            {queue.length
              ? `${queue.length} file(s) ready · ${currentIndex + 1} of ${queue.length}`
              : "No files selected yet."}
          </div>
        </div>
      </GlassPanel>

      <GlassPanel className="p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Set the mood</div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {presets.map((item) => (
            <button
              key={item.id}
              className={`rounded-full border px-3 py-2 text-left ${
                preset === item.id ? "border-white/40 bg-white/20" : "border-white/10 bg-white/10"
              }`}
              onClick={() => setPreset(item.id)}
            >
              {item.label}
            </button>
          ))}
          <label className="col-span-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-left">
            Import Lightroom preset (.xmp)
            <input type="file" className="hidden" accept=".xmp" />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-[color:var(--muted)]">
          {fileInfo ? leakSummary : "Upload a screenshot to scan for leaks before export."}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-xs uppercase tracking-[0.2em]"
            onClick={handleExport}
            disabled={processing || !currentFile}
          >
            Safe export
          </button>
          <button
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em]"
            onClick={handleExportAll}
            disabled={processing || queue.length < 2}
          >
            Safe export all
          </button>
        </div>
      </GlassPanel>

      <GlassPanel className="p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Preview</div>
        <div className="mt-4 flex min-h-[320px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-h-[360px] rounded-2xl" />
          ) : (
            <div className="text-xs text-[color:var(--muted)]">Your screenshot preview appears here.</div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}
