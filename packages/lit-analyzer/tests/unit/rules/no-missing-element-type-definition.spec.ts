import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

test("'no-missing-element-type-definition' reports diagnostic when element is not in HTMLElementTagNameMap", ({
  assert,
}) => {
  const { diagnostics } = getDiagnostics(
    `
		class MyElement extends HTMLElement { }; 
		customElements.define("my-element", MyElement)
	`,
    {
      rules: { 'no-missing-element-type-definition': true },
    }
  )

  hasDiagnostic(assert, diagnostics, 'no-missing-element-type-definition')
})

test("'no-missing-element-type-definition' reports no diagnostic when element is not in HTMLElementTagNameMap", ({
  assert,
}) => {
  const { diagnostics } = getDiagnostics(
    `
		class MyElement extends HTMLElement { }; 
		customElements.define("my-element", MyElement)
		declare global {
			interface HTMLElementTagNameMap {
				"my-element": MyElement
			}
		}
	`,
    {
      rules: { 'no-missing-element-type-definition': true },
    }
  )

  hasNoDiagnostics(assert, diagnostics)
})
