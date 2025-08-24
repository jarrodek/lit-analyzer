import type { Assert } from '@japa/assert'

import { LitAnalyzerRuleId } from '../../src/analyze/lit-analyzer-config.js'
import { LitDiagnostic } from '../../src/analyze/types/lit-diagnostic.js'

export function hasDiagnostic(assert: Assert, diagnostics: LitDiagnostic[], ruleName: LitAnalyzerRuleId): void {
  if (diagnostics.length !== 1) {
    prettyLogDiagnostics(diagnostics)
  }
  assert.lengthOf(diagnostics, 1, 'has exactly one diagnostic')
  assert.equal(diagnostics[0].source, ruleName, 'has correct diagnostic source')
}

export function hasNoDiagnostics(assert: Assert, diagnostics: LitDiagnostic[]): void {
  if (diagnostics.length !== 0) {
    prettyLogDiagnostics(diagnostics)
  }
  assert.lengthOf(diagnostics, 0)
}

function prettyLogDiagnostics(diagnostics: LitDiagnostic[]) {
  console.log(diagnostics.map((diagnostic) => `${diagnostic.source}: ${diagnostic.message}`))
}
