import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

test('Event binding: Callable value is bindable', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input @change="${() => {}}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Event binding: Non callback value is not bindable', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input @change="${(():void => {})()}" />`')
  hasDiagnostic(assert, diagnostics, 'no-noncallable-event-binding')
})

test('Event binding: Number is not bindable', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input @change="${123}" />`')
  hasDiagnostic(assert, diagnostics, 'no-noncallable-event-binding')
})

test('Event binding: Function is bindable', ({ assert }) => {
  const { diagnostics } = getDiagnostics('function foo() {}; html`<input @change="${foo}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Event binding: Called function is not bindable', ({ assert }) => {
  const { diagnostics } = getDiagnostics('function foo() {}; html`<input @change="${foo()}" />`')
  hasDiagnostic(assert, diagnostics, 'no-noncallable-event-binding')
})

test('Event binding: Any type is bindable', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input @change="${{} as any}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test("Event binding: Object with callable 'handleEvent' is bindable 1", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input @change="${{handleEvent: () => {}}}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test("Event binding: Object with callable 'handleEvent' is bindable 2", ({ assert }) => {
  const { diagnostics } = getDiagnostics('function foo() {}; html`<input @change="${{handleEvent: foo}}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test("Event binding: Object with called 'handleEvent' is not bindable", ({ assert }) => {
  const { diagnostics } = getDiagnostics('function foo() {}; html`<input @change="${{handleEvent: foo()}}" />`')
  hasDiagnostic(assert, diagnostics, 'no-noncallable-event-binding')
})

test("Event binding: Object literal without 'handleEvent' is not bindable", ({ assert }) => {
  const { diagnostics } = getDiagnostics('function foo() {}; html`<input @change="${{foo: "bar"}}" />`')
  hasDiagnostic(assert, diagnostics, 'no-noncallable-event-binding')
})

test('Event binding: Mixed value binding with first expression being callable is bindable', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input @change="foo${console.log}bar" />`')
  hasNoDiagnostics(assert, diagnostics)
})
