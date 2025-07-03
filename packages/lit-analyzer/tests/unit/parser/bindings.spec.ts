import { test } from '@japa/runner'

import {
  HtmlNodeAttrAssignmentKind,
  IHtmlNodeAttrAssignmentMixed,
  IHtmlNodeAttrAssignmentString,
} from '../../../src/analyze/types/html-node/html-node-attr-assignment-types.js'
import { parseHtml } from '../../helpers/parse-html.js'

// https://github.com/runem/lit-analyzer/issues/44
test('Correctly parses binding without a missing start quote', ({ assert }) => {
  const res = parseHtml('<button @tap=${console.log}"></button>')
  const attr = res.findAttr((attr) => attr.name === 'tap')!
  const assignment = attr.assignment!

  assert.equal(assignment.kind, HtmlNodeAttrAssignmentKind.MIXED)
  assert.equal(typeof (assignment as IHtmlNodeAttrAssignmentMixed).values[0], 'object')
  assert.equal((assignment as IHtmlNodeAttrAssignmentMixed).values[1], '"')
})

test('Parses element binding', ({ assert }) => {
  const res = parseHtml('<input ${ref(testRef)} />')
  const attr = res.findAttr((attr) => attr.name.startsWith('_'))!
  assert.equal(attr.assignment!.kind, HtmlNodeAttrAssignmentKind.ELEMENT_EXPRESSION)
})

test('Parses multiple element bindings', ({ assert }) => {
  const res = parseHtml('<input ${x} ${y}/>')
  const input = res.rootNodes[0]
  // Make sure we have two attributes even though the expression
  // length is the same
  assert.lengthOf(input.attributes, 2)
})

test('Parses more than 10 element bindings', ({ assert }) => {
  const res = parseHtml('<input ${a} ${b} ${c} ${d} ${e} ${f} ${g} ${h} ${i} ${j} ${k}/>')
  const input = res.rootNodes[0]
  assert.lengthOf(input.attributes, 11)
  assert.equal(input.attributes[10].assignment!.kind, HtmlNodeAttrAssignmentKind.ELEMENT_EXPRESSION)
})

test('Correctly parses binding with no quotes', ({ assert }) => {
  const res = parseHtml('<input value=${"text"} />')
  const attr = res.findAttr((attr) => attr.name === 'value')!
  assert.equal(attr.assignment!.kind, HtmlNodeAttrAssignmentKind.EXPRESSION)
})

test('Correctly parses binding with no expression and no quotes', ({ assert }) => {
  const res = parseHtml('<input value=text />')
  const attr = res.findAttr((attr) => attr.name === 'value')!
  assert.equal(attr.assignment!.kind, HtmlNodeAttrAssignmentKind.STRING)
  assert.equal((attr.assignment as IHtmlNodeAttrAssignmentString).value, 'text')
})

test('Correctly parses binding with single quotes', ({ assert }) => {
  const res = parseHtml("<input value='text' />")
  const attr = res.findAttr((attr) => attr.name === 'value')!
  assert.equal(attr.assignment!.kind, HtmlNodeAttrAssignmentKind.STRING)
})

test('Correctly parses boolean binding', ({ assert }) => {
  const res = parseHtml('<input required />')
  const attr = res.findAttr((attr) => attr.name === 'required')!
  assert.equal(attr.assignment!.kind, HtmlNodeAttrAssignmentKind.BOOLEAN)
})
