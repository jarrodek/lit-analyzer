import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

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
      '**/test/fixtures/**',
      'packages/lit-analyzer/scripts/**',
    ],
  },
  js.configs.recommended,
  eslintPluginPrettierRecommended,
  // TypeScript files with type-checking
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // Remove project-wide type checking to avoid tsconfig issues
        // Individual packages will handle their own type checking during build
      },
      globals: {
        ...globals.node,
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'import': importPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,

      // Import rules
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'ignore',
          'alphabetize': { order: 'asc' },
        },
      ],

      // TypeScript specific
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Quote style - use single quotes
      '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],

      // General rules
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-redeclare': 'off',
    },
  },
  // JavaScript and Module files (no type checking)
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: false,
        console: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      // Standard JavaScript rules
      ...js.configs.recommended.rules,

      // Import rules
      'import/order': [
        'error',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          'alphabetize': { order: 'asc' },
        },
      ],

      // JavaScript-specific rules
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Quote style - use single quotes
      'quotes': ['error', 'single', { avoidEscape: true }],

      // General rules
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  // Test files - Node.js environment
  {
    files: ['**/*.test.{js,ts}', '**/test/**/*.{js,ts}', '**/tests/**/*.{js,ts}', '**/*-test.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.nodeBuiltin,
        ...globals.mocha,
        console: 'readonly',
      },
    },
    rules: {
      // Allow console in tests
      'no-console': 'off',
    },
  },
  // vs-code extension files run in Node.js
  {
    files: ['packages/vscode-lit-plugin/src/**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.nodeBuiltin,
        console: 'readonly',
      },
    },
  },
  {
    files: ['packages/**/bin/*.ts', 'packages/**/tasks/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node, // Enable Node.js globals for these files
      },
    },
    rules: {
      'no-restricted-globals': [
        'error',
        ...Object.keys(globals.browser).filter(
          // Disallow Node-specific globals (unless they are shared)
          (g) => !Object.prototype.hasOwnProperty.call(globals.node, g)
        ),
      ],
    },
  },
  prettier,
]
