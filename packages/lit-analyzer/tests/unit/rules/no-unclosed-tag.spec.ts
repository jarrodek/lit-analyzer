import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

test('Report unclosed tags', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<div><div></div>`', { rules: { 'no-unclosed-tag': true } })
  hasDiagnostic(assert, diagnostics, 'no-unclosed-tag')
})

test("Don't report self closed tags", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<img />`', { rules: { 'no-unclosed-tag': true } })
  hasNoDiagnostics(assert, diagnostics)
})
