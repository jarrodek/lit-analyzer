import { test } from '@japa/runner'

import { getDiagnostics } from '../../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../../helpers/assert.js'

const preface = `
  class TrustedResourceUrl {};
  class SafeUrl {};
  class SafeStyle {};

  const trustedResourceUrl = new TrustedResourceUrl();
  const safeUrl = new SafeUrl();
  const safeStyle = new SafeStyle();

	const anyValue: any = {};
`

test('May bind string to script src with default config', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<script .src=${"/foo.js"}></script>`', {})
  hasNoDiagnostics(assert, diagnostics)
})

test('May not bind string to script src with ClosureSafeTypes config', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<script src=${"/foo.js"}></script>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
})

test('May not bind string to script .src with ClosureSafeTypes config', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<script .src=${"/foo.js"}></script>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
}).skip(true, 'Skipping until I figure out how to handle this')

test('May pass static string to script src with ClosureSafeTypes config', ({ assert }) => {
  const { diagnostics } = getDiagnostics('html`<script src="/foo.js"></script>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasNoDiagnostics(assert, diagnostics)
})

let testName = 'May not pass a TrustedResourceUrl to script src with default config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<script src=${trustedResourceUrl}></script>`')
  hasDiagnostic(assert, diagnostics, 'no-complex-attribute-binding')
})

testName = 'May not pass a TrustedResourceUrl to script .src with default config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<script .src=${trustedResourceUrl}></script>`')
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
}).skip(true, 'Skipping until I figure out how to handle this')

testName = 'May pass a TrustedResourceUrl to script src with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<script src=${trustedResourceUrl}></script>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasNoDiagnostics(assert, diagnostics)
})

testName = 'May pass a TrustedResourceUrl to script .src with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<script .src=${trustedResourceUrl}></script>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasNoDiagnostics(assert, diagnostics)
})

testName = 'May not pass a SafeUrl to script src with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<script src=${safeUrl}></script>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasDiagnostic(assert, diagnostics, 'no-complex-attribute-binding')
})

testName = 'May not pass a SafeUrl to script .src with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<script .src=${safeUrl}></script>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasDiagnostic(assert, diagnostics, 'no-incompatible-type-binding')
}).skip(true, 'Skipping until I figure out how to handle this')

testName = 'May pass `any` to script src with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<script src=${anyValue}></script>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasNoDiagnostics(assert, diagnostics)
})

testName = 'May pass `any` to script .src with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<script .src=${anyValue}></script>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasNoDiagnostics(assert, diagnostics)
})

testName = 'May pass either a SafeUrl, a TrustedResourceUrl, a string, or `any` to img src with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  hasNoDiagnostics(
    assert,
    getDiagnostics(preface + 'html`<img src=${safeUrl}>`', { securitySystem: 'ClosureSafeTypes' }).diagnostics
  )

  hasNoDiagnostics(
    assert,
    getDiagnostics(preface + 'html`<img src=${trustedResourceUrl}>`', {
      securitySystem: 'ClosureSafeTypes',
    }).diagnostics
  )

  hasNoDiagnostics(
    assert,
    getDiagnostics(preface + "html`<img src=${'/img.webp'}>`", {
      securitySystem: 'ClosureSafeTypes',
    }).diagnostics
  )

  hasNoDiagnostics(
    assert,
    getDiagnostics(preface + 'html`<img src=${anyValue}>`', {
      securitySystem: 'ClosureSafeTypes',
    }).diagnostics
  )
})

testName =
  'May pass either a SafeUrl, a TrustedResourceUrl, a string, or `any` to img .src with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  hasNoDiagnostics(
    assert,
    getDiagnostics(preface + 'html`<img .src=${safeUrl}>`', { securitySystem: 'ClosureSafeTypes' }).diagnostics
  )

  hasNoDiagnostics(
    assert,
    getDiagnostics(preface + 'html`<img .src=${trustedResourceUrl}>`', {
      securitySystem: 'ClosureSafeTypes',
    }).diagnostics
  )

  hasNoDiagnostics(
    assert,
    getDiagnostics(preface + "html`<img .src=${'/img.webp'}>`", {
      securitySystem: 'ClosureSafeTypes',
    }).diagnostics
  )

  hasNoDiagnostics(
    assert,
    getDiagnostics(preface + 'html`<img .src=${anyValue}>`', {
      securitySystem: 'ClosureSafeTypes',
    }).diagnostics
  )
})

testName = 'May pass a string to style with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<div style=${"color: red"}></div>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasNoDiagnostics(assert, diagnostics)
})

testName = 'May pass a string to .style with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<div .style=${"color: red"}></div>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasNoDiagnostics(assert, diagnostics)
})

testName = 'May pass a SafeStyle to style with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<div style=${safeStyle}></div>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasNoDiagnostics(assert, diagnostics)
})

testName = 'May pass a SafeStyle to .style with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<div .style=${safeStyle}></div>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasNoDiagnostics(assert, diagnostics)
})

testName = 'May pass a `any` to style with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<div style=${anyValue}></div>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasNoDiagnostics(assert, diagnostics)
})

testName = 'May pass a `any` to .style with ClosureSafeTypes config'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(preface + 'html`<div .style=${anyValue}></div>`', {
    securitySystem: 'ClosureSafeTypes',
  })
  hasNoDiagnostics(assert, diagnostics)
})

testName = 'Types renamed by Clutz are properly matched against allowed types.'
test(testName, ({ assert }) => {
  const { diagnostics } = getDiagnostics(
    [
      {
        fileName: 'main.ts',
        text: `
					// A type name known to have been output by Clutz.
					class module$contents$goog$html$SafeUrl_SafeUrl {}

					html\`<a href='\${"abc" as module$contents$goog$html$SafeUrl_SafeUrl}'>This is a link.</a>\`;

					// A type name of the same format.
					class module$some$clutz$name_TrustedResourceUrl {}

					html\`<script src='\${"abc" as module$some$clutz$name_TrustedResourceUrl}'></script>\`;
				`,
      },
    ],
    {
      securitySystem: 'ClosureSafeTypes',
    }
  )
  hasNoDiagnostics(assert, diagnostics)
})
