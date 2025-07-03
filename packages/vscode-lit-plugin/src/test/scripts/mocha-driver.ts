import * as path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { glob } from 'glob'
import Mocha from 'mocha'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Runs all tests in src/test that are named like *-test.ts with Mocha.
 *
 * Called by @vscode/test-electron's runTests function in ./test-runner
 *
 * Should resolve if the tests pass, reject if any fail.
 */
export async function run(): Promise<void> {
  console.log('Mocha driver starting...')

  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 60_000,
  })

  const testsRoot = path.join(__dirname, '..')
  console.log('Tests root:', testsRoot)

  const files = glob.sync('**/*-test.js', { cwd: testsRoot })
  console.log('Found test files:', files)

  for (const file of files) {
    const fullPath = path.resolve(testsRoot, file)
    console.log('Adding test file:', fullPath)
    mocha.addFile(fullPath)
  }

  console.log('Starting mocha test run...')
  const failures = await new Promise<number>((resolve) => {
    mocha.run((num) => {
      console.log('Mocha run completed with failures:', num)
      resolve(num)
    })
  })

  if (failures > 0) {
    throw new Error(`${failures} tests failed.`)
  }

  console.log('All tests passed!')
}
