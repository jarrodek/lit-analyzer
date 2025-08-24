import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasNoDiagnostics } from '../../helpers/assert.js'

test("Emits 'no-invalid-css' binding diagnostic when a non-css binding is used", ({ assert }) => {
  const { diagnostics } = getDiagnostics('css`\n:host{<input ?type="${true}" />}\n`')
  assert.lengthOf(diagnostics, 2, 'Expected 2 diagnostics to be reported')
  assert.equal(diagnostics[0].source, 'no-invalid-css', 'Expected first diagnostic to be from no-invalid-css rule')
  assert.equal(diagnostics[1].source, 'no-invalid-css', 'Expected second diagnostic to be from no-invalid-css rule')
})

test("Doesn't emit bindings when valid css", ({ assert }) => {
  const { diagnostics } = getDiagnostics('css`\n:host{display: block;}\n`')
  hasNoDiagnostics(assert, diagnostics)
})

test("Doesn't emit bindings for a modern CSS (2025)", ({ assert }) => {
  const value = `
  :host {
    display: none;
    position-area: bottom span-right;
    position-try: --menu-fallback-bottom-left, --menu-fallback-top-right, --menu-fallback-top-left, flip-block;
    position: fixed;
    margin: 0;
    padding: 0;
    border: none;
    max-height: 90vh;
    overflow: auto;
  }

  @position-try --menu-fallback-bottom-left {
    position-area: bottom span-left;
  }

  @position-try --menu-fallback-top-right {
    position-area: top span-right;
  }

  @position-try --menu-fallback-top-left {
    position-area: top span-left;
  }
  `
  const { diagnostics } = getDiagnostics(`css\`${value}\``)
  hasNoDiagnostics(assert, diagnostics)
})

test('Interpolation in property value is tolerated', ({ assert }) => {
  const { diagnostics } = getDiagnostics("css`\ndiv { color: ${'red'}; }\n`")
  hasNoDiagnostics(assert, diagnostics)
})

test('Interpolation inside selector is tolerated', ({ assert }) => {
  const { diagnostics } = getDiagnostics("css`\n${'.my'}-class { display:block }\n`")
  hasNoDiagnostics(assert, diagnostics)
})

test('Accepts modern valid CSS features (container queries, clamp)', ({ assert }) => {
  const value = `
  .card {
    --gap: clamp(1rem, 2vw, 1.5rem);
    gap: var(--gap);
    container-type: inline-size;
  }
  `
  const { diagnostics } = getDiagnostics(`css\`${value}\``)
  hasNoDiagnostics(assert, diagnostics)
})

test('Emits diagnostic for unknown property', ({ assert }) => {
  const { diagnostics } = getDiagnostics('css`\ndiv { some-unknown-prop: 10px }\n`')
  assert.isAtLeast(diagnostics.length, 1, 'Expected diagnostic for unknown CSS property')
  for (const d of diagnostics) assert.equal(d.source, 'no-invalid-css')
})

test('One-liner CSS should be ignored', ({ assert }) => {
  const { diagnostics } = getDiagnostics('css`100px`')
  hasNoDiagnostics(assert, diagnostics)
})
