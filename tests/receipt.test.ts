import { describe, expect, it } from "vitest";
import { createReceipt } from "@/lib/receipts/createReceipt";

describe("createReceipt", () => {
  it("creates a receipt with required fields", () => {
    const receipt = createReceipt({
      original: { name: "input.png", type: "image/png", size: 1000, width: 800, height: 600 },
      exported: { name: "output.png", type: "image/png", size: 900, width: 800, height: 600 },
      found: [{ label: "Metadata detected" }],
      changed: [{ label: "Metadata removed" }],
      remaining: [],
      tips: ["Review before sharing"]
    });
    expect(receipt.timestamp).toBeTruthy();
    expect(receipt.changed.length).toBe(1);
  });
});
