import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

test("Cannot use 'ifDefined' directive in boolean attribute binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type ifDefined = Function; html`<input ?maxlength="${ifDefined({} as number | undefined)}" />`'
  )
  hasDiagnostic(assert, diagnostics, 'no-invalid-directive-binding')
})

test("Can use 'ifDefined' directive in attribute binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type ifDefined = Function; html`<input maxlength="${ifDefined({} as number | undefined)}" />`'
  )
  hasNoDiagnostics(assert, diagnostics)
})

test("Cannot use 'ifDefined' directive in property binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type ifDefined = Function; html`<input .maxLength="${ifDefined({} as number | undefined)}" />`'
  )
  hasDiagnostic(assert, diagnostics, 'no-invalid-directive-binding')
})

test("Cannot use 'ifDefined' directive in event listener binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics('type ifDefined = Function; html`<input @max="${ifDefined(() => {})}" />`')
  hasDiagnostic(assert, diagnostics, 'no-invalid-directive-binding')
})

test("Cannot use 'live' directive in attribute binding with non-string type", ({ assert }) => {
  const { diagnostics } = getDiagnostics('type live = Function; html`<input value="${live(123)}" />`')
  hasDiagnostic(assert, diagnostics, 'no-invalid-directive-binding')
})

test("Can use 'live' directive in attribute binding with string type", ({ assert }) => {
  const { diagnostics } = getDiagnostics('type live = Function; html`<input value="${live(\'test\')}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test("Can use 'live' directive in property binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics('type live = Function; html`<input .maxLength="${live(123)}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test("Can use 'classMap' directive on class attribute", ({ assert }) => {
  const { diagnostics } = getDiagnostics('type classMap = Function; html`<input class="${classMap({foo: true})}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test("Cannot use 'classMap' directive on non-class attribute", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type classMap = Function; html`<input notclass="${classMap({foo: true})}" />`'
  )
  hasDiagnostic(assert, diagnostics, 'no-invalid-directive-binding')
})

test("Cannot use 'classMap' directive in property binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics('type classMap = Function; html`<input .class="${classMap({foo: true})}" />`')
  hasDiagnostic(assert, diagnostics, 'no-invalid-directive-binding')
})

test("Can use 'styleMap' directive on style attribute", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type styleMap = Function; html`<input style="${styleMap({color: "white"})}" />`'
  )
  hasNoDiagnostics(assert, diagnostics)
})

test("Cannot use 'styleMap' directive on non-style attribute", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type styleMap = Function; html`<input nonstyle="${styleMap({color: "white"})}" />`'
  )
  hasDiagnostic(assert, diagnostics, 'no-invalid-directive-binding')
})

test("Cannot use 'styleMap' directive in property binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type classMap = Function; html`<input .style="${styleMap({color: "white"})}" />`'
  )
  hasDiagnostic(assert, diagnostics, 'no-invalid-directive-binding')
})

test("Cannot use 'unsafeHTML' directive in attribute binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type unsafeHTML = Function; html`<input maxlength="${unsafeHTML("<h1>Hello</h1>")}" />`'
  )
  hasDiagnostic(assert, diagnostics, 'no-invalid-directive-binding')
})

test("Can use 'unsafeHTML' directive text binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type unsafeHTML = Function; html`<div>${unsafeHTML("<h1>Hello</h1>")}"</div>`'
  )
  hasNoDiagnostics(assert, diagnostics)
})

test("Can use 'unsafeSVG' directive text binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type unsafeSVG = Function; html`<svg>${unsafeSVG("<circle cx="50" cy="50" r="40" fill="red" />")}"</svg>`'
  )
  hasNoDiagnostics(assert, diagnostics)
})

test("Can use 'templateContent' directive text binding", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'const templateEl = document.querySelector("template#myContent"); type templateContent = Function; html`<div>${templateContent(templateEl)}"</div>`'
  )
  hasNoDiagnostics(assert, diagnostics)
})
