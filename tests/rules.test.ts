import { describe, expect, it } from "vitest";
import { findTextLeaks } from "@/lib/rules/pii";

describe("findTextLeaks", () => {
  it("detects emails and phones", () => {
    const text = "Contact me at hello@example.com or (555) 123-4567";
    const leaks = findTextLeaks(text);
    expect(leaks.some((leak) => leak.type === "email")).toBe(true);
    expect(leaks.some((leak) => leak.type === "phone")).toBe(true);
  });

  it("detects street addresses", () => {
    const text = "Meet me at 123 Market Street tomorrow.";
    const leaks = findTextLeaks(text);
    expect(leaks.some((leak) => leak.type === "address")).toBe(true);
  });
});
