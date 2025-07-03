import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

test("Don't report unknown attributes when 'no-unknown-attribute' is turned off", ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<input foo='' />`", { rules: { 'no-unknown-attribute': false } })
  hasNoDiagnostics(assert, diagnostics)
})

test('Report unknown attributes on known element', ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<input foo='' />`", { rules: { 'no-unknown-attribute': true } })
  hasDiagnostic(assert, diagnostics, 'no-unknown-attribute')
})

test("Don't report unknown attributes", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input required />`', { rules: { 'no-unknown-attribute': true } })
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't report unknown attributes on unknown element", ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<unknown-element foo=''></unknown-element>`", {
    rules: { 'no-unknown-attribute': true, 'no-unknown-tag-name': false },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't report unknown data- attributes", ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<input data-foo='' />`", { rules: { 'no-unknown-attribute': true } })
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't report element expressions", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input ${x} />`', { rules: { 'no-unknown-attribute': true } })
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't report new (2024) attributes", ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<span popover='auto'></span>`", {
    rules: { 'no-unknown-attribute': true },
  })
  hasNoDiagnostics(assert, diagnostics)
})
