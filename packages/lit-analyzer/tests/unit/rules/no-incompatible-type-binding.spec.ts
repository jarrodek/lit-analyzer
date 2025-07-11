import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'
import { makeElement } from '../../helpers/generate-test-file.js'

const lit2DirectiveSetup = `
	export class Directive { }

	export interface DirectiveClass {
		new (part: PartInfo): Directive;
	}

	export type DirectiveParameters<C extends Directive> = Parameters<C['render']>;

	// TODO (justinfagnani): ts-simple-type has a bug, so I remove the generic
	export interface DirectiveResult {
		values: unknown[];
	}

	export const directive = <C extends DirectiveClass>(c: C) => (...values: DirectiveParameters<InstanceType<C>>): DirectiveResult => ({
    ['_$litDirective$']: c,
    values,
  });
`

test('Element binding: non-directive not allowed', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input ${123} />`')
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Element binding: lit-html 1 directives are not allowed', ({ assert }) => {
  const { diagnostics } = getDiagnostics(`
export interface Part { }

const ifDefined: (value: unknown) => (part: Part) => void;

html\`<input \${ifDefined(10)} />\`
	`)
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Element binding: Lit 2 directives are allowed', ({ assert }) => {
  const { diagnostics } = getDiagnostics(`

${lit2DirectiveSetup}

class MyDirective extends Directive {
  render(): number {
		return 42;
	}
}
const myDirective = directive(MyDirective);

html\`<input \${myDirective()} />\`
	`)
  hasNoDiagnostics(assert, diagnostics)
})

test('Element binding: any allowed', ({ assert }) => {
  const { diagnostics } = getDiagnostics(`
const ifDefined: any;

html\`<input \${ifDefined(10)} />\`
	`)
  hasNoDiagnostics(assert, diagnostics)
})

test("Attribute binding: 'no-incompatible-type-binding' is not emitted when the rule is turned off", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="foo" />`', {
    rules: { 'no-incompatible-type-binding': 'off' },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: String literal (a number) is assignable to number', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="123" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: String literal (not a number) is not assignable to number', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="foo" />`')
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Attribute binding: Number type expression is assignable to number', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="${123}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: String literal type expression (a number) is assignable to number', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="${"123"}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: String literal type expression (not a number) is not assignable to number', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="${"foo"}" />`')
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Attribute binding: String type expression is not assignable to number', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="${{} as string}" />`')
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Attribute binding: Expression of type union with two string literals (numbers) is assignable to number', ({
  assert,
}) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="${{} as "123" | "321"}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: Expression of type union with two string literals (one not being a number) is not assignable to number', ({
  assert,
}) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="${{} as "123" | "foo"}" />`')
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Attribute binding: String literal is assignable to string', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input placeholder="foo" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: String literal (a number) is assignable to string', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input placeholder="123" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: String literal expression is assignable to string', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input placeholder="${"foo"}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: Number type expression is assignable to string', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input placeholder="${123}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: String literal (0 length) is assignable to number', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input maxlength="" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: String literal (0 length) is assignable to string', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input placeholder="" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: String literal (0 length) is assignable to boolean', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input required="" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: String literal is not assignable to boolean', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input required="foo" />`', {
    rules: { 'no-boolean-in-attribute-binding': false },
  })
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Attribute binding: Number type expression is not assignable to boolean', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input required="${123}" />`', {
    rules: { 'no-boolean-in-attribute-binding': false },
  })
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Attribute binding: Boolean attribute is assignable to boolean', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input required />`')
  hasNoDiagnostics(assert, diagnostics)
})

test("Attribute binding: Boolean type expression is assignable to 'true'|'false'", ({ assert }) => {
  const { diagnostics } = getDiagnostics('let b = true; html`<input aria-expanded="${b}" />`', {
    rules: { 'no-boolean-in-attribute-binding': false },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test("Attribute binding: Boolean type expression (true) is assignable to 'true'|'false'", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input aria-expanded="${true}" />`', {
    rules: { 'no-boolean-in-attribute-binding': false },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test("Attribute binding: Boolean type expression (false) is assignable to 'true'|'false'", ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input aria-expanded="${false}" />`', {
    rules: { 'no-boolean-in-attribute-binding': false },
  })
  hasNoDiagnostics(assert, diagnostics)
})

test("Attribute binding: Union of 'string | Directive' type expression is assignable to string", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type DirectiveFn = {}; html`<input placeholder="${{} as string | DirectiveFn}" />`'
  )
  hasNoDiagnostics(assert, diagnostics)
})

test('Boolean binding: Empty string literal is not assignable in a boolean attribute binding', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input ?required="${""}" />`')
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Boolean binding: Boolean is assignable in a boolean attribute binding', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input ?required="${true}" />`')
  hasNoDiagnostics(assert, diagnostics)
})

test('Boolean binding: String is not assignable in boolean attribute binding', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<input ?required="${{} as string}" />`')
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Property binding: String literal type expression is not assignable to boolean property', ({ assert }) => {
  const { diagnostics } = getDiagnostics([
    makeElement({ properties: ['required = false'] }),
    'html`<my-element .required="${"foo"}"></my-element>`',
  ])
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Property binding: String literal (0 length) type expression is not assignable to boolean property', ({
  assert,
}) => {
  const { diagnostics } = getDiagnostics([
    makeElement({ properties: ['required = false'] }),
    'html`<my-element .required="${""}"></my-element>`',
  ])
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Property binding: Number type expression is not assignable to boolean property', ({ assert }) => {
  const { diagnostics } = getDiagnostics([
    makeElement({ properties: ['required = false'] }),
    'html`<my-element .required="${123}"></my-element>`',
  ])
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Property binding: Boolean type expression is not assignable to boolean property', ({ assert }) => {
  const { diagnostics } = getDiagnostics([
    makeElement({ properties: ['required = false'] }),
    'html`<my-element .required="${true}"></my-element>`',
  ])
  hasNoDiagnostics(assert, diagnostics)
})

test("Attribute binding: 'ifDefined' directive correctly removes 'undefined' from the type union 1", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type ifDefined = Function; html`<input maxlength="${ifDefined({} as number | undefined)}" />`'
  )
  hasNoDiagnostics(assert, diagnostics)
})

test("Attribute binding: 'ifDefined' directive correctly removes 'undefined' from the type union 2", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type ifDefined = Function; html`<input maxlength="${ifDefined({} as number | string | undefined)}" />`'
  )
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test("Attribute binding: 'guard' directive correctly infers correct type from the callback 1", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type guard = Function; html`<img src="${guard([""], () => "nothing.png")}" />`'
  )
  hasNoDiagnostics(assert, diagnostics)
})

test("Attribute binding: 'guard' directive correctly infers correct type from the callback 2", ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    'type guard = Function; html`<input maxlength="${guard([""], () => ({} as string | number))}" />`'
  )
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test("Attribute binding: using custom directive won't result in diagnostics", ({ assert }) => {
  const { diagnostics } = getDiagnostics(`
export interface Part { }

const ifDefined: (value: unknown) => (part: Part) => void

const ifExists = (value: any) => ifDefined(value === null ? undefined : value);

html\`<input step="\${ifExists(10)}" />\`
	`)
  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: the role attribute is correctly type checked when given valid items', ({ assert }) => {
  const { diagnostics } = getDiagnostics(`html\`<div role="button listitem"></div>\`
	`)

  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: the role attribute is correctly type checked when given invalid items', ({ assert }) => {
  const { diagnostics } = getDiagnostics(`html\`<div role="button foo"></div>\`
	`)

  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

function makeCustomDirective(name = 'myDirective') {
  return `
type DirectiveFn<_T = unknown> = (part: Part) => void;
const ${name} = {} as (<T>(arg: T) => DirectiveFn<T>);
`
}

test('Attribute binding: correctly infers type of generic directive function', ({ assert }) => {
  const { diagnostics } = getDiagnostics(`${makeCustomDirective('myDirective')}
html\`<input step="\${myDirective(10)}" /> \`
	`)

  hasNoDiagnostics(assert, diagnostics)
})

test('Attribute binding: correctly infers type of generic directive function and fails type checking', ({ assert }) => {
  const { diagnostics } = getDiagnostics(`${makeCustomDirective('myDirective')}
html\`<input step="\${myDirective("foo")}" /> \`
	`)

  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('Attribute binding: the target attribute is correctly type checked when given a string', ({ assert }) => {
  const { diagnostics } = getDiagnostics(`html\`<a target="custom-target"></a>\`
	`)

  hasNoDiagnostics(assert, diagnostics)
})
