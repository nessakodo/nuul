import { FaceFinding } from "@/lib/pipeline/types";

type FaceDetectorLike = {
  detect: (input: ImageBitmap | HTMLCanvasElement | HTMLVideoElement) => Promise<{
    boundingBox: { x: number; y: number; width: number; height: number };
  }[]>;
};

export async function detectFaces(imageData: ImageData): Promise<FaceFinding[]> {
  if (typeof window === "undefined") return [];
  const FaceDetectorCtor = (window as typeof window & { FaceDetector?: new () => FaceDetectorLike }).FaceDetector;
  if (!FaceDetectorCtor) return [];

  const detector = new FaceDetectorCtor();
  const bitmap = await createImageBitmap(imageData);
  const faces = await detector.detect(bitmap);
  bitmap.close();

  return faces.map((face) => ({
    boundingBox: {
      x: face.boundingBox.x,
      y: face.boundingBox.y,
      width: face.boundingBox.width,
      height: face.boundingBox.height
    },
    confidence: "medium"
  }));
}
