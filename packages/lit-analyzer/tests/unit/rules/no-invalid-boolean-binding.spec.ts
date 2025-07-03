import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

test("Emits 'no-invalid-boolean-binding' diagnostic when a boolean binding is used on a non-boolean type", ({
  assert,
}) => {
  const { diagnostics } = getDiagnostics('html`<input ?type="${true}" />`')
  hasDiagnostic(assert, diagnostics, 'no-invalid-boolean-binding')
}).skip(true)

test("Emits no 'no-invalid-boolean-binding' diagnostic when the rule is turned off", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input ?type="${true}" />`', {
    rules: { 'no-invalid-boolean-binding': 'off' },
  })
  hasNoDiagnostics(assert, diagnostics)
}).skip(true)

test("Emits no 'no-invalid-boolean-binding' diagnostic when a boolean binding is used on a boolean type", ({
  assert,
}) => {
  const { diagnostics } = getDiagnostics('html`<input ?disabled="${true}" />`')
  hasNoDiagnostics(assert, diagnostics)
}).skip(true)
