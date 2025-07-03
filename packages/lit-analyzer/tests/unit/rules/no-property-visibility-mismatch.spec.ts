import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'
import { TestFile } from '../../helpers/compile.js'

function makeTestElement({
  properties,
}: {
  properties?: Array<{ visibility: string; name: string; internal: boolean }>
}): TestFile {
  return {
    fileName: 'my-element.ts',
    text: `
		class MyElement extends HTMElement {
			${(properties || [])
        .map(
          ({ name, visibility, internal }) =>
            `@${internal ? 'internalProperty' : 'property'}() ${visibility} ${name}: any;`
        )
        .join('\n')}
		};
		customElements.define("my-element", MyElement);
		`,
  }
}

test('Report public @internalProperty properties', ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    makeTestElement({
      properties: [{ name: 'foo', visibility: 'public', internal: true }],
    }),
    {
      rules: { 'no-property-visibility-mismatch': true },
    }
  )
  hasDiagnostic(assert, diagnostics, 'no-property-visibility-mismatch')
})

test('Report private @property properties', ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    makeTestElement({
      properties: [{ name: 'foo', visibility: 'private', internal: false }],
    }),
    {
      rules: { 'no-property-visibility-mismatch': true },
    }
  )
  hasDiagnostic(assert, diagnostics, 'no-property-visibility-mismatch')
})

test("Don't report regular public properties", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    makeTestElement({
      properties: [{ name: 'foo', visibility: 'public', internal: false }],
    }),
    {
      rules: { 'no-property-visibility-mismatch': true },
    }
  )
  hasNoDiagnostics(assert, diagnostics)
})
