export type RiskLevel = "social" | "work" | "high";
export type Confidence = "high" | "medium" | "low";

export interface FileInfo {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
}

export interface MetadataFindings {
  exifPresent: boolean;
  gpsPresent: boolean;
  deviceIdentifiersPresent: boolean;
  embeddedThumbnailPresent: boolean;
}

export interface TextLeak {
  type: "email" | "phone" | "address" | "order" | "api_key" | "seed" | "token";
  value: string;
  confidence: Confidence;
  suggested: boolean;
}

export interface CodeFinding {
  type: "qr";
  boundingBox: { x: number; y: number; width: number; height: number };
  confidence: Confidence;
  autoApply: boolean;
}

export interface FaceFinding {
  boundingBox: { x: number; y: number; width: number; height: number };
  confidence: Confidence;
}

export interface ScanFindings {
  metadata: MetadataFindings;
  textLeaks: TextLeak[];
  codes: CodeFinding[];
  faces: FaceFinding[];
  screenHints: string[];
  chromeConfidence: Confidence | null;
  topBarHeight: number | null;
  linkabilityReduced: boolean;
}

export interface ReceiptAction {
  label: string;
  detail?: string;
}

export interface Receipt {
  timestamp: string;
  original: FileInfo;
  exported: FileInfo;
  found: ReceiptAction[];
  changed: ReceiptAction[];
  remaining: ReceiptAction[];
  tips: string[];
}
