Place tesseract.js assets here to avoid any network fetches.

Required files:
- /public/tesseract/worker.min.js
- /public/tesseract/tesseract-core.wasm.js
- /public/tesseract/lang-data/eng.traineddata

This keeps OCR fully local and ensures the Network Monitor stays at zero during processing.
