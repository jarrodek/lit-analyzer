import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  outfile: 'built/bundle.js',
  platform: 'node',
  // minify: true,
  // target: 'es2017',
  format: 'esm',
  color: true,
  external: ['vscode', 'typescript'],
  mainFields: ['module', 'main'],
})

await esbuild.build({
  entryPoints: ['../ts-lit-plugin/src/index.ts'],
  bundle: true,
  outfile: 'built/node_modules/@jarrodek/ts-lit-plugin/index.js',
  platform: 'node',
  external: ['typescript'],
  // minify: true,
  // target: 'es2017',
  format: 'esm',
  color: true,
  mainFields: ['module', 'main'],
})
