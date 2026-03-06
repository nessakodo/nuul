import exifr from "exifr";
import { detectQrCodes } from "@/lib/detectors/qr";
import { detectScreenHints } from "@/lib/detectors/screenHints";
import { detectFaces } from "@/lib/detectors/faces";
import { findTextLeaks } from "@/lib/rules/pii";
import { ScanFindings } from "@/lib/pipeline/types";

export async function scanImage(
  file: File,
  imageData: ImageData,
  ocrText?: string
): Promise<ScanFindings> {
  let exif: Record<string, unknown> | null = null;
  try {
    exif = await exifr.parse(file, { tiff: true, ifd0: true, exif: true, gps: true });
  } catch {
    exif = null;
  }

  const metadata = {
    exifPresent: !!exif,
    gpsPresent: !!exif && "gps" in (exif as Record<string, unknown>),
    deviceIdentifiersPresent:
      !!exif && ("Make" in (exif as Record<string, unknown>) || "Model" in (exif as Record<string, unknown>)),
    embeddedThumbnailPresent: !!exif && "Thumbnail" in (exif as Record<string, unknown>)
  };

  const textLeaks = ocrText ? findTextLeaks(ocrText) : [];
  const codes = detectQrCodes(imageData);
  const faces = await detectFaces(imageData);
  const screenHintResult = detectScreenHints({
    width: imageData.width,
    height: imageData.height,
    fileName: file.name,
    imageData
  });

  return {
    metadata,
    textLeaks,
    codes,
    faces,
    screenHints: screenHintResult.hints,
    chromeConfidence: screenHintResult.chromeConfidence,
    topBarHeight: screenHintResult.topBarHeight,
    linkabilityReduced: true
  };
}
