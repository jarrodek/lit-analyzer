import test from 'ava'
import * as tsModule from 'typescript'

import { setTypescriptModule } from '../../lib/analyze/ts-module.js'

/**
 * Returns the current ts module
 */
export function getCurrentTsModule(): typeof tsModule {
  return tsModule
}

/**
 * Wrap the ava test module - simplified version without multi-version testing
 */
export const tsTest = Object.assign(test, {
  only: test.only,
  skip: test.skip,
})

// Initialize the TypeScript module for helper functions
setTypescriptModule(tsModule)
