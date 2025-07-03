import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

test("Don't report legacy attributes when 'no-legacy-attribute' is turned off", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input required?=${true} />`', {
    rules: { 'no-legacy-attribute': false },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test('Report legacy attributes on known element', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input required?=${true} />`', {
    rules: { 'no-legacy-attribute': true },
  })
  hasDiagnostic(assert, diagnostics, 'no-legacy-attribute')
})

test('Report legacy attribute values on known element', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input value="{{foo}}" />`', { rules: { 'no-legacy-attribute': true } })
  hasDiagnostic(assert, diagnostics, 'no-legacy-attribute')
})

test("Don't report non-legacy boolean attributes", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input ?required=${true} />`', {
    rules: { 'no-legacy-attribute': true },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't report non-legacy attributes", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input required />`', { rules: { 'no-legacy-attribute': true } })
  hasNoDiagnostics(assert, diagnostics)
})
