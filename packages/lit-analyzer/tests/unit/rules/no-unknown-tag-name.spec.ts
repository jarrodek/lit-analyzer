import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'
import { makeElement } from '../../helpers/generate-test-file.js'

test('Report unknown custom elements', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<unknown-element></unknown-element>`', {
    rules: { 'no-unknown-tag-name': true },
  })
  hasDiagnostic(assert, diagnostics, 'no-unknown-tag-name')
})

test("Don't report known built in elements", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<div></div>`', { rules: { 'no-unknown-tag-name': true } })
  hasNoDiagnostics(assert, diagnostics)
})

test('Report unknown built in elements', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<element></element>`', { rules: { 'no-unknown-tag-name': true } })
  hasDiagnostic(assert, diagnostics, 'no-unknown-tag-name')
})

test("Don't report known custom elements found in other file", ({ assert }) => {
  const { diagnostics } = getDiagnostics([makeElement({}), 'html`<my-element></my-element>`'], {
    rules: { 'no-unknown-tag-name': true },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't report known custom element", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    "class MyElement extends HTMLElement {}; customElements.define('my-element', MyElement); html`<my-element></my-element>`",
    {
      rules: { 'no-unknown-tag-name': true },
    }
  )
  hasNoDiagnostics(assert, diagnostics)
})

test('runem/lit-analyzer/issues/386 - binding inside a bare <colgroup>', ({ assert }) => {
  const { diagnostics } = getDiagnostics(" return html` <colgroup> ${''} </colgroup> `;", {
    rules: { 'no-unknown-tag-name': true },
  })
  hasNoDiagnostics(assert, diagnostics)
}).skip(true, 'parse5 does not handle <colgroup> with bindings properly')
