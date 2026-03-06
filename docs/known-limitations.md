# Known limitations

- No guarantee against face search, reverse image search, or determined adversaries.
- Face detection uses the browser FaceDetector when available; unsupported browsers will not flag faces.
- OCR requires local Tesseract assets (see `public/tesseract/README.txt`).
- OCR accuracy depends on image quality, fonts, and device performance.
- Manual redaction tools are UI placeholders.
- Receipt Vault currently stores receipts in localStorage, not IndexedDB.
