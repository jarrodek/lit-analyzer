import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

test("'no-incompatible-property-type' is not emitted for string types without configuration", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    `
  /**
   * @element
	 */
	class MyElement extends LitElement {
		@property() color: string;
	}
	`,
    { rules: { 'no-incompatible-property-type': 'on' } }
  )

  hasNoDiagnostics(assert, diagnostics)
})

test("'no-incompatible-property-type' is not emitted for string types with String configuration", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    `
  /**
   * @element
	 */
	class MyElement extends LitElement {
		@property({type: String}) color: string;
	}
	`,
    { rules: { 'no-incompatible-property-type': 'on' } }
  )

  hasNoDiagnostics(assert, diagnostics)
})

test("'no-incompatible-property-type' is emitted for string types with non-String configuration", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    `
  /**
   * @element
	 */
	class MyElement extends LitElement {
		@property({type: Number}) color: string;
	}
	`,
    { rules: { 'no-incompatible-property-type': 'on' } }
  )

  hasDiagnostic(assert, diagnostics, 'no-incompatible-property-type')
})

test("'no-incompatible-property-type' is emitted for non-string types with no configuration", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    `
  /**
   * @element
	 */
	class MyElement extends LitElement {
		@property() color: number;
	}
	`,
    { rules: { 'no-incompatible-property-type': 'on' } }
  )

  hasDiagnostic(assert, diagnostics, 'no-incompatible-property-type')
})

test("'no-incompatible-property-type' is emitted for number types with non-Number configuration", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    `
  /**
   * @element
	 */
	class MyElement extends LitElement {
		@property({type: String}) color: number;
	}
	`,
    { rules: { 'no-incompatible-property-type': 'on' } }
  )

  hasDiagnostic(assert, diagnostics, 'no-incompatible-property-type')
})

test("'no-incompatible-property-type' is not emitted for number types with Number configuration", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    `
  /**
   * @element
	 */
	class MyElement extends LitElement {
		@property({type: Number}) color: number;
	}
	`,
    { rules: { 'no-incompatible-property-type': 'on' } }
  )

  hasNoDiagnostics(assert, diagnostics)
})
