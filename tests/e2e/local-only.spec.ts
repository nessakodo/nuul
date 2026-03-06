import { test, expect } from "@playwright/test";
import path from "path";

const fixturePath = path.resolve(__dirname, "../fixtures/sample.png");

test("no network requests during scan or export", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Open Studio" }).click();
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => (window as any).__nuulOcrWarm === true, null, { timeout: 20000 });

  let requestCount = 0;
  page.on("request", () => {
    requestCount += 1;
  });

  const fileInput = page.locator("input[type=file]");
  await fileInput.setInputFiles(fixturePath);

  await page.waitForSelector("text=Processing", { state: "hidden", timeout: 20000 });

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Safe Export" }).click()
  ]);
  await download.path();

  await expect(page.getByText("Sanitization verified.")).toBeVisible({ timeout: 20000 });
  expect(requestCount).toBe(0);
});
