import jsQR from "jsqr";
import { CodeFinding } from "@/lib/pipeline/types";

export function detectQrCodes(imageData: ImageData): CodeFinding[] {
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  if (!code) return [];

  const topLeft = code.location.topLeftCorner;
  const bottomRight = code.location.bottomRightCorner;
  const width = Math.abs(bottomRight.x - topLeft.x);
  const height = Math.abs(bottomRight.y - topLeft.y);

  return [
    {
      type: "qr",
      boundingBox: {
        x: Math.min(topLeft.x, bottomRight.x),
        y: Math.min(topLeft.y, bottomRight.y),
        width,
        height
      },
      confidence: "high",
      autoApply: true
    }
  ];
}
