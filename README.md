# Business Card Scanner

A Progressive Web App that scans business cards, extracts contact information, and exports it as a VCF file or WhatsApp message. Runs entirely in the browser with no backend.

![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-A855F7?logo=pwa&logoColor=white)

---

## Features

**Image capture** -- snap a photo with your phone camera or upload from gallery. Images are compressed client-side (max 1920px, JPEG 95%) before processing.

**Three extraction engines** -- pick the one that fits:

| Method             | How it works                  | Best for         | API key        |
| ------------------ | ----------------------------- | ---------------- | -------------- |
| Fast OCR (Local)   | Tesseract.js, runs in-browser | Offline, privacy | None           |
| Smart AI (Gemma 4) | Google GenAI API              | High accuracy    | Google API key |
| Qianfan-OCR-Fast   | Baidu OCR via OpenRouter      | Free cloud OCR   | OpenRouter key |

Your selection persists across sessions via localStorage.

**Contact parsing** extracts name, company, email, phone, and website from OCR/AI output using regex matching, company suffix detection, and name heuristics.

**Editable form** -- five fields you can correct before exporting, plus a collapsible raw text view for manual review.

**Export options:**

- VCF 3.0 download (opens in any address book)
- WhatsApp deep link with pre-filled message

**PWA** -- installable on Android/iOS, works offline. Workbox caches static assets and Tesseract CDN resources (30-day cache).

**Dark mode** -- follows system `prefers-color-scheme`. No toggle needed.

---

## Tech Stack

| Layer     | Technology                  | Version |
| --------- | --------------------------- | ------- |
| UI        | React                       | 19      |
| Build     | Vite                        | 8       |
| Styling   | Tailwind CSS                | 4       |
| Local OCR | Tesseract.js                | 7       |
| AI        | @google/genai               | 2       |
| Cloud OCR | OpenRouter (via OpenAI SDK) | --      |
| PWA       | vite-plugin-pwa (Workbox)   | 1.3     |

---

## Getting Started

Requires Node.js 18+.

```bash
git clone <repo-url>
cd business-card-scanner
npm install
npm run dev
```

Dev server starts at `http://localhost:5173`.

### Scripts

| Command           | Action                      |
| ----------------- | --------------------------- |
| `npm run dev`     | Dev server with HMR         |
| `npm run build`   | Production build to `dist/` |
| `npm run preview` | Preview production build    |
| `npm run lint`    | ESLint                      |

---

## API Key Setup

Keys are stored in localStorage. Nothing is sent to a server beyond the API call you choose to make.

**Google Gemini (Smart AI)**

1. Get a key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Paste it in the app when prompted after selecting Smart AI

**OpenRouter (Qianfan-OCR-Fast)**

1. Sign up at [openrouter.ai](https://openrouter.ai/)
2. Generate a key from your dashboard
3. Paste it in the app when prompted after selecting Qianfan-OCR-Fast

Local OCR needs no key. No data leaves your device.

---

## Project Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Root component, state machine
├── components/
│   ├── Scanner.jsx           # Image capture, method selector, progress
│   ├── ResultForm.jsx        # Editable contact fields + raw text
│   └── ExportActions.jsx     # VCF download, WhatsApp link
├── utils/
│   ├── ocr.js                # Tesseract.js singleton worker
│   ├── parser.js             # Regex-based contact extraction
│   ├── llm.js                # Gemini + OpenRouter clients
│   └── vcf.js                # VCF 3.0 generation
├── App.css
└── index.css                 # Theme variables, Tailwind imports
```

---

## Deployment

Static build -- deploy `dist/` anywhere.

**Vercel:**

```bash
vercel --prod
```

**Netlify:**

```bash
netlify deploy --prod
```

---

## Privacy

- No backend. Fully client-side.
- API keys stay in your browser.
- Local OCR processes everything on-device.
- AI/cloud methods send only the card image to the selected provider.

## License

MIT
