/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				canvas: "var(--canvas)",
				ink: "var(--ink)",
				"ink-deep": "var(--ink-deep)",
				charcoal: "var(--charcoal)",
				body: "var(--body)",
				mute: "var(--mute)",
				stone: "var(--stone)",
				ash: "var(--ash)",
				"surface-soft": "var(--surface-soft)",
				"surface-card": "var(--surface-card)",
				"surface-dark": "var(--surface-dark)",
				"surface-dark-elevated": "var(--surface-dark-elevated)",
				hairline: "var(--hairline)",
				"hairline-strong": "var(--hairline-strong)",
				whatsapp: "var(--color-whatsapp)",
			},
			fontFamily: {
				mono: [
					'"Berkeley Mono"',
					'"JetBrains Mono"',
					'"IBM Plex Mono"',
					"ui-monospace",
					'"SFMono-Regular"',
					"Menlo",
					"Monaco",
					"Consolas",
					'"Liberation Mono"',
					'"Courier New"',
					"monospace",
				],
			},
		},
	},
	plugins: [],
};
