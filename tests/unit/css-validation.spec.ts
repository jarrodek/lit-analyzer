import { test } from '@japa/runner'
import { getDiagnostics } from '../helpers/analyze.js'
import { hasDiagnostic, hasNoDiagnostics } from '../helpers/assert.js'

test.group('CSS Validation', () => {
  test('Validate CSS property', ({ assert }) => {
    // Use multi-line to ensure validation runs
    const { diagnostics } = getDiagnostics(
      `css\`
                div { 
                    position-area-invalid: center bottom; 
                }
            \``,
      {
        rules: { 'no-invalid-css': true },
      }
    )

    hasDiagnostic(assert, diagnostics, 'no-invalid-css')
  })

  test('Support position-area CSS property', ({ assert }) => {
    const { diagnostics } = getDiagnostics(
      `css\`
                div { 
                    position-area: center bottom; 
                }
            \``,
      {
        rules: { 'no-invalid-css': true },
      }
    )

    hasNoDiagnostics(assert, diagnostics)
  })

  test('Support other anchor positioning properties', ({ assert }) => {
    const { diagnostics } = getDiagnostics(
      `css\`
                div { 
                    position-anchor: --my-anchor;
                    position-try: flip-block;
                    position-visibility: no-overflow;
                }
            \``,
      {
        rules: { 'no-invalid-css': true },
      }
    )

    hasNoDiagnostics(assert, diagnostics)
  })
})
