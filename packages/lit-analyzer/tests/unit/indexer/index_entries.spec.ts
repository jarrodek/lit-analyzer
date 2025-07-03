import { Assert } from '@japa/assert'
import { test } from '@japa/runner'
import ts, { Node, SourceFile } from 'typescript'

import { LitIndexEntry } from '../../../src/analyze/document-analyzer/html/lit-html-document-analyzer.js'
import { HtmlNodeAttrKind } from '../../../src/analyze/types/html-node/html-node-attr-types.js'
import { HtmlNodeKind } from '../../../src/analyze/types/html-node/html-node-types.js'
import { getIndexEntries } from '../../helpers/analyze.js'

test.group('indexer', () => {
  test('No entries are created for HTML-like template strings if the template tags are not named "html".', ({
    assert,
  }) => {
    const { indexEntries } = getIndexEntries([
      {
        fileName: 'main.js',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {}
          customElements.define('some-element', SomeElement);
  
          const nothtml = x => x;
          nothtml\`<some-element></some-element>\`;
        `,
      },
    ])
    const entries = Array.from(indexEntries)
    assert.lengthOf(entries, 0, 'No index entries should be created for non-html template tags')
  })

  test('No entries are created for elements that are not defined with `customElements`.', ({ assert }) => {
    const { indexEntries } = getIndexEntries([
      {
        fileName: 'main.js',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {}
  
          const html = x => x;
          html\`<some-element></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries)
    assert.lengthOf(entries, 0, 'No index entries should be created for elements not defined with customElements')
  })

  test("No entries are created for tags that don't match any definition.", ({ assert }) => {
    const { indexEntries } = getIndexEntries([
      {
        fileName: 'main.js',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {}
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          const html = x => x;
          html\`<unknown-element></unknown-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries)
    assert.lengthOf(entries, 0)
  })

  /**
   * Asserts that `identifier` is the identifier of a class with name `className`
   * in the file `sourceFile`.
   */
  const assertIdentifiesClass = ({
    assert,
    identifier,
    sourceFile,
    className,
  }: {
    assert: Assert
    identifier: Node
    sourceFile?: SourceFile
    className: string
  }) => {
    const { isClassDeclaration, isIdentifier } = ts

    if (!isIdentifier(identifier)) {
      throw new Error("The definition target's node should be an identifier.")
    }

    assert.equal(identifier.getSourceFile(), sourceFile!, 'The identifier is not in the expected source file.')
    assert.equal(identifier.text, className, `The identifier's text should be \`${className}\`.`)

    const { parent: identParent } = identifier
    if (!isClassDeclaration(identParent)) {
      throw new Error("The target node's parent should be a class declaration.")
    }

    assert.equal(identParent.name, identifier, "The target node should be it's class definition's name.")
  }

  /**
   * Asserts that `entry` is a `HtmlNodeIndexEntry` that describes an element with
   * tag name `tagName` that is defined by a single class named `className` in
   * `sourceFile`.
   */
  const assertEntryTargetsClass = ({
    assert,
    entry,
    sourceFile,
    tagName,
    className,
  }: {
    assert: Assert
    entry: LitIndexEntry
    sourceFile?: SourceFile
    tagName: string
    className: string
  }) => {
    if (entry.kind !== 'NODE-REFERENCE') {
      throw new Error('The entry does not originate from an element.')
    }

    const { node: entryNode } = entry
    assert.equal(entryNode.kind, HtmlNodeKind.NODE, 'The entry should not originate from an `<svg>` or `<style>`.')
    assert.equal(entryNode.tagName, tagName, `The origin element is not a \`<${tagName}>\`.`)

    const { targets } = entry.definition
    assert.lengthOf(targets, 1, 'The definition should have a single target.')

    const [target] = targets
    if (target.kind !== 'node') {
      throw new Error('The definition target should be a `LitDefinitionTargetNode`.')
    }

    assertIdentifiesClass({ assert, identifier: target.node, sourceFile, className })
  }

  test('Element references can reference elements defined in the same file. (JS)', ({ assert }) => {
    const { indexEntries, sourceFile } = getIndexEntries([
      {
        fileName: 'main.js',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {}
          customElements.define('some-element', SomeElement);
  
          const html = x => x;
          html\`<some-element></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries)
    assert.lengthOf(entries, 1)

    assertEntryTargetsClass({
      assert,
      entry: entries[0],
      sourceFile,
      tagName: 'some-element',
      className: 'SomeElement',
    })
  })

  test('Element references can reference elements defined in the same file. (TS)', ({ assert }) => {
    const { indexEntries, sourceFile } = getIndexEntries([
      {
        fileName: 'main.ts',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {}
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          const html = x => x;
          html\`<some-element></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries)
    assert.lengthOf(entries, 1)

    assertEntryTargetsClass({
      assert,
      entry: entries[0],
      sourceFile,
      tagName: 'some-element',
      className: 'SomeElement',
    })
  })

  test('An entry is created for elements that are not defined with `customElements` if they are added to `HTMLElementTagNameMap` in TS.', ({
    assert,
  }) => {
    const { indexEntries, sourceFile } = getIndexEntries([
      {
        fileName: 'main.ts',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {}
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          const html = x => x;
          html\`<some-element></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries)
    assert.lengthOf(entries, 1)

    assertEntryTargetsClass({
      assert,
      entry: entries[0],
      sourceFile,
      tagName: 'some-element',
      className: 'SomeElement',
    })
  })

  test('Element references can reference elements defined in a different file.', ({ assert }) => {
    const { indexEntries, program } = getIndexEntries([
      {
        fileName: 'main.js',
        entry: true,
        text: `
          import './some-element.js';
  
          const html = x => x;
          html\`<some-element></some-element>\`;
        `,
      },
      {
        fileName: 'some-element.ts',
        text: `
          class SomeElement extends HTMLElement {}
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
        `,
      },
    ])

    const entries = Array.from(indexEntries)
    assert.lengthOf(entries, 1)

    assertEntryTargetsClass({
      assert,
      entry: entries[0],
      sourceFile: program.getSourceFile('some-element.ts'),
      tagName: 'some-element',
      className: 'SomeElement',
    })
  })

  test("Attribute references are not created for attributes that don't map to known properties.", ({ assert }) => {
    const { indexEntries } = getIndexEntries([
      {
        fileName: 'main.ts',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {
            prop: string;
          }
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          const html = x => x;
          html\`<some-element .unknown="abc" other-unknown="def"></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries).filter((entry) => entry.kind === 'ATTRIBUTE-REFERENCE')
    assert.lengthOf(entries, 0)
  })

  /**
   * Asserts that `entry` is a `HtmlNodeAttrIndexEntry` with name `name` and kind
   * `kind` that has a single target `LitDefinitionTargetNode`.
   */
  const assertIsAttrRefAndGetTarget = ({
    assert,
    entry,
    name,
    kind,
  }: {
    assert: Assert
    entry: LitIndexEntry
    name: string
    kind: HtmlNodeAttrKind
  }) => {
    if (entry.kind !== 'ATTRIBUTE-REFERENCE') {
      throw new Error('The entry does not originate from an attribute.')
    }

    const { attribute: entryAttr } = entry
    assert.equal(entryAttr.name, name, `The attribute name should be \`${name}\`.`)
    assert.equal(entryAttr.kind, kind, `The attribute kind should be \`${kind}\`.`)

    const { targets } = entry.definition
    assert.lengthOf(targets, 1, 'The definition should have a single target.')

    const [target] = targets
    if (target.kind !== 'node') {
      throw new Error('The definition target should be a `LitDefinitionTargetNode`.')
    }

    return target
  }

  const assertIsAttrRefTargetingClass = ({
    assert,
    entry,
    name,
    kind,
    sourceFile,
    className,
  }: {
    assert: Assert
    entry: LitIndexEntry
    name: string
    kind: HtmlNodeAttrKind
    sourceFile: SourceFile
    className: string
  }) => {
    const { isClassDeclaration } = ts

    const { node: targetNode, name: targetName } = assertIsAttrRefAndGetTarget({
      assert,
      entry,
      name,
      kind,
    })

    assert.equal(targetNode.getSourceFile(), sourceFile, 'The target node is not in the expected source file.')
    if (targetName !== name) {
      throw new Error(`The target node's name should be \`${name}\`.`)
    }

    // Find the nearest class declaration.
    let ancestor: Node = targetNode.parent
    while (!isClassDeclaration(ancestor)) {
      ancestor = ancestor.parent
    }

    if (!ancestor?.name) {
      throw new Error('The target node was not contained in a named class.')
    }

    assertIdentifiesClass({
      assert,
      identifier: ancestor.name,
      sourceFile,
      className: className,
    })
  }

  test('Attribute references can reference properties defined in the static `properties` getter.', ({ assert }) => {
    const { indexEntries, sourceFile } = getIndexEntries([
      {
        fileName: 'main.ts',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {
            static get properties() {
              return {
                prop: {type: String},
              };
            };
          }
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          const html = x => x;
          html\`<some-element .prop="abc"></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries).filter((entry) => entry.kind === 'ATTRIBUTE-REFERENCE')
    assert.lengthOf(entries, 1)

    assertIsAttrRefTargetingClass({
      assert,
      entry: entries[0],
      name: 'prop',
      kind: HtmlNodeAttrKind.PROPERTY,
      sourceFile,
      className: 'SomeElement',
    })
  })

  test('Attribute references can reference properties defined with a class field.', ({ assert }) => {
    const { indexEntries, sourceFile } = getIndexEntries([
      {
        fileName: 'main.ts',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {
            prop = "abc";
          }
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          const html = x => x;
          html\`<some-element .prop="abc"></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries).filter((entry) => entry.kind === 'ATTRIBUTE-REFERENCE')
    assert.lengthOf(entries, 1)

    assertIsAttrRefTargetingClass({
      assert,
      entry: entries[0],
      name: 'prop',
      kind: HtmlNodeAttrKind.PROPERTY,
      sourceFile,
      className: 'SomeElement',
    })
  })

  test('Attribute references can reference properties defined with a setter.', ({ assert }) => {
    const { indexEntries, sourceFile } = getIndexEntries([
      {
        fileName: 'main.ts',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {
            set prop() {}
          }
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          const html = x => x;
          html\`<some-element .prop="abc"></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries).filter((entry) => entry.kind === 'ATTRIBUTE-REFERENCE')
    assert.lengthOf(entries, 1)

    assertIsAttrRefTargetingClass({
      assert,
      entry: entries[0],
      name: 'prop',
      kind: HtmlNodeAttrKind.PROPERTY,
      sourceFile,
      className: 'SomeElement',
    })
  })

  test('Attribute references can reference properties defined by assignment in the constructor.', ({ assert }) => {
    const { indexEntries, sourceFile } = getIndexEntries([
      {
        fileName: 'main.ts',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {
            constructor() {
              super();
              this.prop = "def";
            }
          }
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          const html = x => x;
          html\`<some-element .prop="abc"></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries).filter((entry) => entry.kind === 'ATTRIBUTE-REFERENCE')
    assert.lengthOf(entries, 1)

    assertIsAttrRefTargetingClass({
      assert,
      entry: entries[0],
      name: 'prop',
      kind: HtmlNodeAttrKind.PROPERTY,
      sourceFile,
      className: 'SomeElement',
    })
  })

  test('Attribute references can reference properties defined in `observedAttributes`.', ({ assert }) => {
    const { indexEntries, sourceFile } = getIndexEntries([
      {
        fileName: 'main.ts',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {
            static get observedAttributes() {
              return ["some-attr"];
            }
          }
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          const html = x => x;
          html\`<some-element some-attr="abc"></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries).filter((entry) => entry.kind === 'ATTRIBUTE-REFERENCE')
    assert.lengthOf(entries, 1)

    assertIsAttrRefTargetingClass({
      assert,
      entry: entries[0],
      name: 'some-attr',
      kind: HtmlNodeAttrKind.ATTRIBUTE,
      sourceFile,
      className: 'SomeElement',
    })
  })

  test('Boolean attribute references have the right kind.', ({ assert }) => {
    const { indexEntries, sourceFile } = getIndexEntries([
      {
        fileName: 'main.ts',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {
            static get properties() {
              return {
                prop: {type: Boolean},
              };
            };
          }
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          const html = x => x;
          html\`<some-element ?prop="abc"></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries).filter((entry) => entry.kind === 'ATTRIBUTE-REFERENCE')
    assert.lengthOf(entries, 1)

    assertIsAttrRefTargetingClass({
      assert,
      entry: entries[0],
      name: 'prop',
      kind: HtmlNodeAttrKind.BOOLEAN_ATTRIBUTE,
      sourceFile,
      className: 'SomeElement',
    })
  })

  test('Attribute references have the right kind.', ({ assert }) => {
    const { indexEntries, sourceFile } = getIndexEntries([
      {
        fileName: 'main.ts',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {
            static get properties() {
              return {
                // The indexer shouldn't mistake plain attributes with properties
                // of the same name.
                prop: {type: String},
              };
            };
          }
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          const html = x => x;
          html\`<some-element prop="abc"></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries).filter((entry) => entry.kind === 'ATTRIBUTE-REFERENCE')
    assert.lengthOf(entries, 1)

    assertIsAttrRefTargetingClass({
      assert,
      entry: entries[0],
      name: 'prop',
      kind: HtmlNodeAttrKind.ATTRIBUTE,
      sourceFile,
      className: 'SomeElement',
    })
  })

  test('Event listeners do not produce entries.', ({ assert }) => {
    const { indexEntries } = getIndexEntries([
      {
        fileName: 'main.ts',
        entry: true,
        text: `
          class SomeElement extends HTMLElement {
            static get properties() {
              return {
                // The indexer shouldn't mistake event listeners with properties
                // of the same name.
                someEvent: {type: Function},
              };
            };
          }
          customElements.define('some-element', SomeElement);
  
          declare global {
            interface HTMLElementTagNameMap {
              'some-element': SomeElement;
            }
          }
  
          // Supporting this might be a nice improvement but it doesn't currently work.
  
          interface SomeElementEventMap extends HTMLElementEventMap, WindowEventHandlersEventMap {
            'someEvent': Event;
          }
  
          interface SomeElement {
            addEventListener<K extends keyof SomeElementEventMap>(type: K, listener: (this: SomeElement, ev: SomeElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
            addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
            removeEventListener<K extends keyof SomeElementEventMap>(type: K, listener: (this: SomeElement, ev: SomeElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
            removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
          }
  
          const html = x => x;
          html\`<some-element @someEvent=$\{(e) => console.log(e)}></some-element>\`;
        `,
      },
    ])

    const entries = Array.from(indexEntries).filter((entry) => entry.kind === 'ATTRIBUTE-REFERENCE')
    assert.lengthOf(entries, 0)
  })
})
