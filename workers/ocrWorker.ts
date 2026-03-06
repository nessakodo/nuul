import { createWorker } from "tesseract.js";

let workerPromise: Promise<Awaited<ReturnType<typeof createWorker>>> | null = null;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = (async () => {
      const worker = (await createWorker({
        workerPath: "/tesseract/worker.min.js",
        langPath: "/tesseract/lang-data",
        corePath: "/tesseract/tesseract-core.wasm.js"
      } as any)) as any;
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      return worker;
    })();
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
