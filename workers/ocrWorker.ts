import { createWorker } from "tesseract.js";

let workerPromise: ReturnType<typeof createWorker> | null = null;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = createWorker({
      workerPath: "/tesseract/worker.min.js",
      langPath: "/tesseract/lang-data",
      corePath: "/tesseract/tesseract-core.wasm.js"
    });
    await workerPromise.load();
    await workerPromise.loadLanguage("eng");
    await workerPromise.initialize("eng");
  }
  return workerPromise;
}

self.onmessage = async (event: MessageEvent) => {
  const { id, imageData, type } = event.data as { id: string; imageData?: ImageData; type?: string };
  try {
    const worker = await getWorker();
    if (type === "warmup") {
      self.postMessage({ id, text: "" });
      return;
    }
    if (!imageData) {
      self.postMessage({ id, text: "" });
      return;
    }
    const result = await worker.recognize(imageData);
    self.postMessage({ id, text: result.data.text ?? "" });
  } catch (error) {
    self.postMessage({ id, error: (error as Error).message });
  }
};
