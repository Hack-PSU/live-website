/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./src/components/**/*.{js,ts,jsx,tsx}",
		"./src/app/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				// Barlow Condensed — headings, nav, buttons
				condensed: ["var(--font-barlow)", "sans-serif"],
				// DM Sans — body copy
				sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
				// Orbitron — clocks, counters, eyebrow labels
				mono: ["var(--font-orbitron)", "monospace"],
			},
			colors: {
				// HackPSU Live palette, sampled off the logo
				ink: "#0A1E2E",
				"ink-deep": "#081826",
				surface: "#0D2B3E",
				"surface-raised": "#10384F",
				navy: "#103850",
				slate: "#7088B8",
				"slate-light": "#A8BCDA",
				"slate-dim": "#54708E",
				foam: "#F2F5FA",
				ember: "#E07050",
				"ember-light": "#EE8E6E",
				gold: "#E2C75E",
				sky: "#64A5C3",
				clay: "#B6663C",
				// hairline used on every card/divider in the design
				line: "rgba(112,136,184,.22)",
				"line-strong": "rgba(112,136,184,.45)",

				// shadcn tokens (kept so components/ui/* work unchanged)
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			spacing: {
				4.5: "1.125rem",
				5.5: "1.375rem",
				6.5: "1.625rem",
				7.5: "1.875rem",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				hpblink: {
					"0%, 100%": { opacity: "0.35" },
					"50%": { opacity: "1" },
				},
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				hpblink: "hpblink 1.7s ease-in-out infinite",
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};
