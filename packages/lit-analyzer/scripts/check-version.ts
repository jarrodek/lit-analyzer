/* eslint-disable no-undef */
import * as fs from 'fs'
import * as path from 'path'

import pkg from '../package.json' with { type: 'json' }

const { version } = pkg

const constantsPath = path.resolve('src/analyze/constants.ts')
const constantsSource = fs.readFileSync(constantsPath, 'utf-8')

if (!constantsSource.includes(`'${version}'`)) {
  // eslint-disable-next-line no-console
  console.log(`\nExpected src/analyze/constants.ts to contain the current version '${version}'`)
  process.exit(1)
}
