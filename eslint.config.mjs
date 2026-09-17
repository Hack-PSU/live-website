import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	globalIgnores([
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
		// CommonJS config files, not application source.
		"tailwind.config.js",
		"postcss.config.js",
	]),
	{
		/*
		 * src/lib/api and src/lib/providers are copied verbatim from
		 * Hack-PSU/frontend-template so the two repos stay diffable. They predate
		 * these rules; relax them here rather than forking the shared code, and
		 * fix upstream instead.
		 */
		files: ["src/lib/api/**/*.ts", "src/lib/providers/**/*.tsx"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-unused-vars": "warn",
			"react-hooks/set-state-in-effect": "off",
			"react-hooks/exhaustive-deps": "warn",
		},
	},
]);

export default eslintConfig;
