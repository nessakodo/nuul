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
  { id: "graphite", label: "Graphite", tone: "from-[#0d0f12] via-[#1c1f27] to-[#30323b]" },
  { id: "warm", label: "Warm Film", tone: "from-[#1a1311] via-[#3c2d23] to-[#6a503b]" },
  { id: "noir", label: "Noir", tone: "from-[#0b0c0f] via-[#1a1c22] to-[#2a2d36]" },
  { id: "studio", label: "Studio", tone: "from-[#141115] via-[#2d2424] to-[#3a3130]" },
  { id: "chrome", label: "Chrome", tone: "from-[#0f1419] via-[#24303a] to-[#3a4853]" },
  { id: "dusk", label: "Dusk", tone: "from-[#111018] via-[#2a2434] to-[#443b4f]" }
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
          <label className="flex w-full cursor-pointer flex-col rounded-2xl border border-white/10 bg-white/10 px-4 py-6 text-left text-sm backdrop-blur">
            Upload image(s)
            <span className="mt-1 text-xs text-[color:var(--muted)]">JPG, PNG, WEBP · Batch supported</span>
            <input ref={fileInputRef} type="file" className="hidden" onChange={onPick} accept="image/*" multiple />
          </label>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-[color:var(--muted)]">
            {queue.length
              ? `${queue.length} file(s) ready · ${currentIndex + 1} of ${queue.length}`
              : "No files selected yet."}
          </div>
        </div>
      </GlassPanel>

      <GlassPanel className="p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">Set the mood</div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          {presets.map((item) => (
            <button
              key={item.id}
              className={`relative h-28 overflow-hidden rounded-2xl border text-left ${
                preset === item.id ? "border-white/40" : "border-white/10"
              }`}
              onClick={() => setPreset(item.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.tone}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="relative z-10 p-3">
                <div className="text-sm font-semibold text-white">{item.label}</div>
                <div className="text-[0.6rem] text-white/60">Preview</div>
              </div>
            </button>
          ))}
          <label className="col-span-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-left">
            Import Lightroom preset (.xmp)
            <input type="file" className="hidden" accept=".xmp" />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-[color:var(--muted)]">
          {fileInfo ? leakSummary : "We scan locally for API keys, QR codes, and metadata before export."}
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
