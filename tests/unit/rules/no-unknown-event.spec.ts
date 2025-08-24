import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

test("Don't report unknown events when 'no-unknown-event' is turned off", ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<input @foo='${console.log}' />`", {
    rules: { 'no-unknown-event': false },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test('Report unknown events on known element', ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<input @foo='${console.log}' />`", {
    rules: { 'no-unknown-event': true },
  })
  hasDiagnostic(assert, diagnostics, 'no-unknown-event')
})

test("Don't report known events", ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<input @click='${console.log}' />`", {
    rules: { 'no-unknown-event': true },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't report known events (HTML5)", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<div contentEditable="true" @paste=\'${console.log}\'></div>`', {
    rules: { 'no-unknown-event': true },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't report unknown events on unknown element", ({ assert }) => {
  const { diagnostics } = getDiagnostics("html`<unknown-element @foo='${console.log}'></unknown-element>`", {
    rules: { 'no-unknown-event': true, 'no-unknown-tag-name': false },
  })
  hasNoDiagnostics(assert, diagnostics)
})
