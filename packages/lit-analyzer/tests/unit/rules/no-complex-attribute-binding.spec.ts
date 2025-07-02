import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'
import { makeElement } from '../../helpers/generate-test-file.js'

test('Complex types are not assignable using an attribute binding', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input placeholder="${{foo: "bar"}}" />`')
  hasDiagnostic(assert, diagnostics, 'no-complex-attribute-binding')
})

test('Complex types are assignable using a property binding', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input .onclick="${() => {}}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Primitives are not assignable to complex type using an attribute binding', ({ assert }) => {
  const { diagnostics } = getDiagnostics([
    makeElement({ properties: ['complex = {foo: string}'] }),
    'html`<my-element complex="bar"></my-element>`',
  ])
  hasDiagnostic(assert, diagnostics, 'no-complex-attribute-binding')
})

test('Complex types are assignable using property binding', ({ assert }) => {
  const { diagnostics } = getDiagnostics([
    makeElement({ properties: ['complex = {foo: string}'] }),
    'html`<my-element .complex="${{foo: "bar"}}"></my-element>`',
  ])
  hasNoDiagnostics(assert, diagnostics)
})

test("Don't check for the assignability of complex types in attribute bindings if the type is a custom lit directive", ({
  assert,
}) => {
  const { diagnostics } = getDiagnostics(
    'type Part = {}; type ifExists = (val: any) => (part: Part) => void; html`<input maxlength="${ifExists(123)}" />`'
  )
  hasNoDiagnostics(assert, diagnostics)
})

test('Ignore element expressions', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input ${{x: 1}} />`', {
    rules: { 'no-incompatible-type-binding': false },
  })
  hasNoDiagnostics(assert, diagnostics)
})
