import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default [
	// Base ignores - apply to all configurations
	{
		ignores: [
			'node_modules/**',
			'**/node_modules/**',
			'**/lib/**',
			'**/out/**',
			'**/dist/**',
			'**/build/**',
			'**/coverage/**',
			'**/*.d.ts',
			'**/temp/**',
			'.wireit/**',
			'**/.wireit/**',
			'packages/*/lib/**',
			'packages/*/out/**',
			'packages/*/test/**',
			'packages/*/index.*',
			'packages/vscode-lit-plugin/built/**',
			'dev/**',
		]
	},
	js.configs.recommended,
	// TypeScript files with type-checking
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
				project: [
					"./tsconfig.json",
					"./packages/*/tsconfig.json",
					"./dev/tsconfig.json",
				],
			},
		},
		plugins: {
			"@typescript-eslint": tseslint,
			import: importPlugin,
		},
		rules: {
			...tseslint.configs.recommended.rules,
			...tseslint.configs["recommended-requiring-type-checking"].rules,

			// Import rules
			"import/order": [
				"error",
				{
					groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
					"newlines-between": "always",
					alphabetize: { order: "asc" },
				},
			],

			// TypeScript specific
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/prefer-nullish-coalescing": "error",
			"@typescript-eslint/prefer-optional-chain": "error",

			// General rules
			"no-console": "warn",
			"prefer-const": "error",
			"no-var": "error",
		},
	},
	// JavaScript and Module files (no type checking)
	{
		files: ["**/*.{js,mjs,cjs}"],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
			globals: {
				process: "readonly",
				Buffer: "readonly",
				__dirname: "readonly",
				__filename: "readonly",
				module: "readonly",
				require: "readonly",
				exports: "readonly",
				global: "readonly",
			},
		},
		plugins: {
			"@typescript-eslint": tseslint,
			import: importPlugin,
		},
		rules: {
			// Only basic TS rules for JS files
			...tseslint.configs.recommended.rules,

			// Import rules
			"import/order": [
				"error",
				{
					groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
					"newlines-between": "always",
					alphabetize: { order: "asc" },
				},
			],

			// Disable type-checking rules for JS
			"@typescript-eslint/no-var-requires": "off",
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-explicit-any": "off",

			// General rules
			"no-console": "warn",
			"prefer-const": "error",
			"no-var": "error",
		},
	},
	prettier,
  {
		ignores: [
			'node_modules',
			'**/node_modules',
			'lib',
			'**/coverage',
			'**/*.d.ts',
			'**/*.test.{js,ts}',
			'**/*.spec.{js,ts}',
			'**/dist',
			'**/build',
			'**/out',
			'**/temp',
      '.wireit',
      '**/.wireit',
			'/packages/*/lib',
			'/packages/*/out',
			'/packages/*/scripts',
			'/packages/*/test',
			'/packages/*/index.*',
			'/packages/vscode-lit-plugin/built'
		]
	}
];
