import ts, { Node, TaggedTemplateExpression } from 'typescript'

import { HtmlDocument } from '../../src/analyze/parse/document/text-document/html-document/html-document.js'
import { parseHtmlDocument } from '../../src/analyze/parse/document/text-document/html-document/parse-html-document.js'

import { compileFiles } from './compile.js'

export function parseHtml(html: string): HtmlDocument {
  const { sourceFile } = compileFiles([`html\`${html}\``])
  const taggedTemplateExpression = findTaggedTemplateExpression(sourceFile)!
  return parseHtmlDocument(taggedTemplateExpression)
}

function findTaggedTemplateExpression(node: Node): TaggedTemplateExpression | undefined {
  if (ts.isTaggedTemplateExpression(node)) {
    return node
  }

  return node.forEachChild(findTaggedTemplateExpression)
}
