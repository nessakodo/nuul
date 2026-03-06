export class OCRClient {
  private worker: Worker | null = null;
  private pending = new Map<string, (value: string) => void>();

  init() {
    if (this.worker) return;
    this.worker = new Worker(new URL("../../workers/ocrWorker.ts", import.meta.url), { type: "module" });
    this.worker.onmessage = (event) => {
      const { id, text } = event.data as { id: string; text?: string };
      const resolver = this.pending.get(id);
      if (resolver) {
        resolver(text ?? "");
        this.pending.delete(id);
      }
    };
  }

  async recognize(imageData: ImageData): Promise<string> {
    this.init();
    const id = crypto.randomUUID();
    const promise = new Promise<string>((resolve) => this.pending.set(id, resolve));
    this.worker?.postMessage({ id, imageData });
    return promise;
  }

  async warmUp(): Promise<void> {
    this.init();
    const id = crypto.randomUUID();
    const promise = new Promise<void>((resolve) => this.pending.set(id, () => resolve()));
    this.worker?.postMessage({ id, type: "warmup" });
    return promise;
  }
}
