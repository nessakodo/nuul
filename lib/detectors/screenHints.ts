export function detectScreenHints(params: {
  width: number;
  height: number;
  fileName?: string;
  imageData?: ImageData;
}): { hints: string[]; chromeConfidence: "high" | "medium" | "low" | null; topBarHeight: number | null } {
  const hints: string[] = [];
  let chromeConfidence: "high" | "medium" | "low" | null = null;
  let topBarHeight: number | null = null;
  const { width, height, fileName, imageData } = params;
  const aspect = width / height;

  if (fileName && /screenshot/i.test(fileName)) {
    hints.push("File name suggests screenshot");
  }

  if (aspect > 0.5 && aspect < 0.8) {
    hints.push("Likely mobile screenshot");
  }

  if (aspect > 1.2 && aspect < 2.4 && width >= 1000) {
    hints.push("Likely desktop screenshot");
  }

  if (imageData) {
    const topSliceHeight = Math.max(4, Math.floor(height * 0.08));
    const totalPixels = width * topSliceHeight;
    let sum = 0;
    let sumSq = 0;
    const data = imageData.data;
    for (let y = 0; y < topSliceHeight; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        sum += luminance;
        sumSq += luminance * luminance;
      }
    }
    const samples = (width / 2) * (topSliceHeight / 2);
    const mean = sum / samples;
    const variance = sumSq / samples - mean * mean;
    const stdDev = Math.sqrt(Math.max(variance, 0));

    if (stdDev < 18 && aspect > 1.2) {
      chromeConfidence = stdDev < 10 ? "high" : "medium";
      topBarHeight = topSliceHeight;
      hints.push("Browser UI detected. Consider cropping or enabling auto crop to content.");
    }
  }

  return { hints, chromeConfidence, topBarHeight };
}
