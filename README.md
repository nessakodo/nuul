# NUUL — Safe Export Studio

NUUL is a local-first Safe Export studio that scans screenshots for common leaks (API keys, QR codes, emails, addresses, tabs) and exports a sanitized file. All processing runs in the browser. No uploads. No accounts.

## Local development

```bash
npm install
npm run dev
```

## Local OCR assets (no network)\n\nTesseract assets must be served locally to avoid any OCR network requests. Place the files listed in `/Users/nessakodo/reef/nuul/public/tesseract/README.txt`.\n
## Build

```bash
npm run build
npm start
```

## Mobile (iOS via Capacitor)

```bash
npx cap add ios
npm run build:export
npm run mobile:sync
npm run mobile:ios
```

## Desktop (Electron)

```bash
npm run build:export
npm run desktop:dev
```

```bash
npm run desktop:build
```

## Privacy promise

- Files never leave your device unless you export them.
- No third-party analytics by default.
- Optional Receipt Vault stores receipts locally only.

## Known limitations

- No guarantee against face search, reverse image search, or determined adversaries.
- Face detection uses the browser FaceDetector when available; on unsupported browsers it is skipped.
- OCR accuracy depends on image quality and device performance.
- Manual redaction tools are UI-only placeholders.
- Receipt Vault currently uses localStorage; IndexedDB support is planned.

## Testing

```bash
npm run test
npm run test:e2e
```
