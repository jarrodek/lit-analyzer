import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'
import { makeElement } from '../../helpers/generate-test-file.js'

test("Cannot assign 'undefined' in attribute binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="${{} as number | undefined}" />`')
  hasDiagnostic(assert, diagnostics, 'no-nullable-attribute-binding')
})

test("Can assign 'undefined' in property binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics([
    makeElement({ slots: ['foo: number | undefined'] }),
    'html`<my-element .foo="${{} as number | undefined}" />`',
  ])
  hasNoDiagnostics(assert, diagnostics)
})

test("Cannot assign 'null' in attribute binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="${{} as number | null}" />`')
  hasDiagnostic(assert, diagnostics, 'no-nullable-attribute-binding')
})

test("Can assign 'null' in property binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input .selectionEnd="${{} as number | null}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test("Message for 'null' in attribute detects null type correctly", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="${{} as number | null}" />`')
  hasDiagnostic(assert, diagnostics, 'no-nullable-attribute-binding')

  assert.isTrue(diagnostics[0].message.includes("can end up binding the string 'null'"))
})

test("Message for 'undefined' in attribute detects undefined type correctly", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="${{} as number | undefined}" />`')
  hasDiagnostic(assert, diagnostics, 'no-nullable-attribute-binding')

  assert.isTrue(diagnostics[0].message.includes("can end up binding the string 'undefined'"))
})
