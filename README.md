# Business Card Scanner PWA

A fast, offline-capable Progressive Web App that scans business cards, extracts contact information using on-device OCR, and lets you save contacts or message them directly.

## Features

- **On-Device OCR**: Uses Tesseract.js to scan cards without sending images to a server.
- **Smart Parsing**: Automatically extracts names, phone numbers, emails, and company details.
- **Export Options**: Download as `.vcf` (vCard) to save directly to your phone's contacts, or open WhatsApp instantly.
- **PWA Ready**: Install on your home screen and use offline.
- **Modern UI**: Clean, responsive design built with Oat CSS.

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm, yarn, or pnpm

### Installation & Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deployment (Simple)

This app is a static React site built with Vite. It can be deployed for free on any static hosting platform.

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root and follow the prompts.
3. For production, run `vercel --prod`.

### Netlify
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run `netlify deploy` and follow the prompts.
3. For production, run `netlify deploy --prod`.

### GitHub Pages
1. Install gh-pages: `npm install gh-pages --save-dev`
2. Add `"homepage": "https://<your-username>.github.io/<repo-name>"` to `package.json`.
3. Add deploy scripts to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Run `npm run deploy`.

## Tech Stack
- React
- Vite
- Tesseract.js (OCR)
- Oat CSS
