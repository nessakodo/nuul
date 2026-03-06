import { canvasToBlob } from "@/lib/pipeline/image";
import { CodeFinding } from "@/lib/pipeline/types";

export interface ExportOptions {
  format: "image/jpeg" | "image/png" | "image/webp";
  quality?: number;
  maxEdge?: number;
  blurRegions?: CodeFinding[];
  addGrain?: boolean;
  cropTop?: number;
}

export async function exportSanitized(
  bitmap: ImageBitmap,
  options: ExportOptions
): Promise<{ blob: Blob; width: number; height: number; type: string }> {
  const scale = options.maxEdge ? Math.min(1, options.maxEdge / Math.max(bitmap.width, bitmap.height)) : 1;
  const targetWidth = Math.round(bitmap.width * scale);
  const targetHeight = Math.round(bitmap.height * scale);
  const cropTop = Math.max(0, options.cropTop ?? 0);
  const cropTopScaled = Math.round(cropTop * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = Math.max(1, targetHeight - cropTopScaled);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.drawImage(
    bitmap,
    0,
    cropTop,
    bitmap.width,
    bitmap.height - cropTop,
    0,
    0,
    targetWidth,
    targetHeight - cropTopScaled
  );

  if (options.blurRegions?.length) {
    options.blurRegions.forEach((region) => {
      const { x, y, width: w, height: h } = region.boundingBox;
      const temp = document.createElement("canvas");
      temp.width = w;
      temp.height = h;
      const tctx = temp.getContext("2d");
      if (!tctx) return;
      tctx.drawImage(canvas, x, y, w, h, 0, 0, w, h);
      ctx.save();
      ctx.filter = "blur(18px)";
      ctx.drawImage(temp, x, y);
      ctx.restore();
    });
  }

  if (options.addGrain) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 10;
      imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + grain));
      imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + grain));
      imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + grain));
    }
    ctx.putImageData(imageData, 0, 0);
  }

  const blob = await canvasToBlob(canvas, options.format, options.quality);
  return { blob, width: canvas.width, height: canvas.height, type: options.format };
}
