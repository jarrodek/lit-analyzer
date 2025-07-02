import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'
import { makeElement } from '../../helpers/generate-test-file.js'

test("Don't report unknown properties when 'no-unknown-property' is turned off", ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<input .foo='${''}' />`", { rules: { 'no-unknown-property': false } })
  hasNoDiagnostics(assert, diagnostics)
})

test('Report unknown properties on known element', ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<input .foo='${''}' />`", { rules: { 'no-unknown-property': true } })
  hasDiagnostic(assert, diagnostics, 'no-unknown-property')
})

test("Don't report known properties", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    [makeElement({ properties: ['foo: string'] }), "html`<my-element .foo='${''}'></my-element>`"],
    {
      rules: { 'no-unknown-property': true },
    }
  )
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't report unknown properties on unknown element", ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<unknown-element .foo='${''}'></unknown-element>`", {
    rules: { 'no-unknown-property': true, 'no-unknown-tag-name': false },
  })
  hasNoDiagnostics(assert, diagnostics)
})
