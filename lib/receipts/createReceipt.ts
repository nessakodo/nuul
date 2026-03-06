import { FileInfo, Receipt, ReceiptAction } from "@/lib/pipeline/types";

export function createReceipt(params: {
  original: FileInfo;
  exported: FileInfo;
  found: ReceiptAction[];
  changed: ReceiptAction[];
  remaining: ReceiptAction[];
  tips: string[];
}): Receipt {
  return {
    timestamp: new Date().toISOString(),
    original: params.original,
    exported: params.exported,
    found: params.found,
    changed: params.changed,
    remaining: params.remaining,
    tips: params.tips
  };
}
