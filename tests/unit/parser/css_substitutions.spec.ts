import type { Assert } from '@japa/assert'
import { test } from '@japa/runner'

import { CssDocument } from '../../../src/analyze/parse/document/text-document/css-document/css-document.js'
import { VirtualAstCssDocument } from '../../../src/analyze/parse/document/virtual-document/virtual-css-document.js'
import { findTaggedTemplates } from '../../../src/analyze/parse/tagged-template/find-tagged-templates.js'
import { compileFiles } from '../../helpers/compile.js'

function createCssDocument(testFile: string): CssDocument {
  const { sourceFile } = compileFiles(testFile)
  const taggedTemplates = findTaggedTemplates(sourceFile, ['css'])
  return new CssDocument(new VirtualAstCssDocument(taggedTemplates[0]))
}

function isTemplateText(assert: Assert, text: string, testFile: string) {
  assert.equal(text, createCssDocument(testFile).virtualDocument.text)
}

test.group('Parser / CSS Substitutions', () => {
  test('Substitute for template followed by percent', ({ assert }) => {
    isTemplateText(
      assert,
      '{ div { transform-origin: 0000% 0000%; } }',
      'css`{ div { transform-origin: ${x}% ${y}%; } }`'
    )
  })

  test('Substitute for template last in css list', ({ assert }) => {
    isTemplateText(assert, '{ div { border: 2px solid ________; } }', 'css`{ div { border: 2px solid ${COLOR}; } }`')
  })

  test('Substitute for template first in css list', ({ assert }) => {
    isTemplateText(
      assert,
      '{ div { border: ________ solid #ffffff; } }',
      'css`{ div { border: ${WIDTH} solid #ffffff; } }`'
    )
  })

  test('Substitute for template middle in css list', ({ assert }) => {
    isTemplateText(
      assert,
      '{ div { border: 2px ________ #ffffff; } }',
      'css`{ div { border: 2px ${STYLE} #ffffff; } }`'
    )
  })

  test('Substitute for template css key-value pair', ({ assert }) => {
    isTemplateText(assert, '{ div { $_:_______________________; } }', "css`{ div { ${unsafeCSS('color: red')}; } }`")
  })

  test('Substitute for template css value only', ({ assert }) => {
    isTemplateText(assert, '{ div { color: ___________________; } }', "css`{ div { color: ${unsafeCSS('red')}; } }`")
  })

  test('Substitute for template css key only', ({ assert }) => {
    isTemplateText(assert, '{ div { $____________________: red; } }', "css`{ div { ${unsafeCSS('color')}: red; } }`")
  })
})
