import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

test('Report mixed binding with expression and "', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input value=${"foo"}" />`')
  hasDiagnostic(assert, diagnostics, 'no-unintended-mixed-binding')
})

test("Report mixed binding with expression and '", ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<input value=${'foo'}' />`")
  hasDiagnostic(assert, diagnostics, 'no-unintended-mixed-binding')
})

test('Report mixed binding with expression and }', ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<input value=${'foo'}} />`")
  hasDiagnostic(assert, diagnostics, 'no-unintended-mixed-binding')
})

test('Report mixed binding with expression and /', ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<input value=${'foo'}/>`")
  hasDiagnostic(assert, diagnostics, 'no-unintended-mixed-binding')
})

test("Don't report mixed binding with expression and %", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input value=${42}% />`')
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't report mixed event listener binding directly followed by /", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input @input=${console.log}/>`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Report mixed binding with expression and } inside quotes', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input value="${"foo"}}" />`')
  hasDiagnostic(assert, diagnostics, 'no-unintended-mixed-binding')
})
