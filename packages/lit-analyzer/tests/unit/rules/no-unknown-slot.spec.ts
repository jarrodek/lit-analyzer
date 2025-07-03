import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'
import { makeElement } from '../../helpers/generate-test-file.js'

test('Report unknown slot name', ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    [makeElement({ slots: ['foo'] }), "html`<my-element><div slot='bar'></div></my-element>`"],
    {
      rules: { 'no-unknown-slot': true },
    }
  )
  hasDiagnostic(assert, diagnostics, 'no-unknown-slot')
})

test("Don't report known slot name", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    [makeElement({ slots: ['foo'] }), "html`<my-element><div slot='foo'></div></my-element>`"],
    {
      rules: { 'no-unknown-slot': true },
    }
  )
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't report known, unnamed slot name", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    [makeElement({ slots: [''] }), "html`<my-element><div slot=''></div></my-element>`"],
    {
      rules: { 'no-unknown-slot': true },
    }
  )
  hasNoDiagnostics(assert, diagnostics)
})

test('Report missing slot attribute', ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    [makeElement({ slots: ['foo'] }), 'html`<my-element><div></div></my-element>`'],
    {
      rules: { 'no-unknown-slot': true },
    }
  )
  hasDiagnostic(assert, diagnostics, 'no-unknown-slot')
})
