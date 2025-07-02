/* eslint-disable no-undef */
import * as fs from 'fs'
import * as path from 'path'

// @ts-expect-error after compilation this will be located in the parent directory
import pkg from '../package.json' with { type: 'json' }

const { version } = pkg

const constantsPath = path.resolve('src/lib/analyze/constants.ts')
const constantsSource = fs.readFileSync(constantsPath, 'utf-8')

if (!constantsSource.includes(`'${version}'`)) {
  // eslint-disable-next-line no-console
  console.log(`\nExpected src/lib/analyze/constants.ts to contain the current version '${version}'`)
  process.exit(1)
}
