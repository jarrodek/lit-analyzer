/* eslint-disable no-console */
import { mkdir, copyFile, writeFile, cp } from 'node:fs/promises'

import tsPluginPackageJson from '../ts-lit-plugin/package.json' with { type: 'json' }

import pluginPackageJson from './package.json' with { type: 'json' }

/**
 * Copy files into the ./built directory.
 *
 * This is the directory that actually has the final filesystem layout for
 * the extension, and to keep the vsix file small we want to only include
 * those files that are needed.
 *
 * Note that ./built/bundle.js is generated directly by esbuild.script.js and
 * not copied by this script.
 */
async function main() {
  // We don't bundle the typescript compiler into ./built/bundle.js, so we need
  // a copy of it.
  await mkdir('./built/node_modules/typescript/lib', { recursive: true })
  await copyFile('../../node_modules/typescript/package.json', './built/node_modules/typescript/package.json')
  await copyFile('../../node_modules/typescript/lib/typescript.js', './built/node_modules/typescript/lib/typescript.js')
  await copyFile(
    '../../node_modules/typescript/lib/tsserverlibrary.js',
    './built/node_modules/typescript/lib/tsserverlibrary.js'
  )

  // For the TS compiler plugin, it must be in node modules because that's
  // hard coded by the TS compiler's custom module resolution logic.
  await mkdir('./built/node_modules/@jarrodek/ts-lit-plugin', { recursive: true })
  // We're only using the bundled version, so the plugin doesn't need any
  // dependencies.
  tsPluginPackageJson.dependencies = {}
  await writeFile('./built/node_modules/ts-lit-plugin/package.json', JSON.stringify(tsPluginPackageJson, null, 2))
  await copyFile('../ts-lit-plugin/index.js', './built/node_modules/ts-lit-plugin/index.js')

  // vsce is _very_ picky about the directories in node_modules matching the
  // extension's package.json, so we need an entry for @jarrodek/ts-lit-plugin or it
  // will think that it's extraneous.
  pluginPackageJson.dependencies['@jarrodek/ts-lit-plugin'] = '*'
  await writeFile('./built/package.json', JSON.stringify(pluginPackageJson, null, 2))

  // Copy static files used by the extension.
  await copyFile('./LICENSE.md', './built/LICENSE.md')
  await copyFile('./README.md', './built/README.md')
  await cp('./docs', './built/docs', { recursive: true })
  await cp('./syntaxes', './built/syntaxes', { recursive: true })
  await cp('./schemas', './built/schemas', { recursive: true })
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
