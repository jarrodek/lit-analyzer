import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

test('Non-boolean-binding with an empty string value is valid', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input required="" />`', {
    rules: { 'no-boolean-in-attribute-binding': true },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test('Non-boolean-binding with a boolean type expression is not valid', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="${true}" />`', {
    rules: { 'no-boolean-in-attribute-binding': true },
  })
  hasDiagnostic(assert, diagnostics, 'no-boolean-in-attribute-binding')
})

test('Non-boolean-binding on a boolean type attribute with a non-boolean type expression is not valid', ({
  assert,
}) => {
  const { diagnostics } = getDiagnostics('html`<input required="${{} as string}" />`', {
    rules: { 'no-boolean-in-attribute-binding': true, 'no-incompatible-type-binding': true },
  })
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test("Boolean assigned to 'true|'false' doesn't emit 'no-boolean-in-attribute-binding' warning", ({ assert }) => {
  const { diagnostics } = getDiagnostics('let b: boolean = true; html`<input aria-expanded="${b}" />`', {
    rules: { 'no-boolean-in-attribute-binding': true },
  })
  hasNoDiagnostics(assert, diagnostics)
})
