import { HtmlNodeAttr } from '../../../../types/html-node/html-node-attr-types.js'
import { HtmlNode } from '../../../../types/html-node/html-node-types.js'
import { DocumentOffset, DocumentRange } from '../../../../types/range.js'
import { intersects } from '../../../../util/range-util.js'
import { VirtualDocument } from '../../virtual-document/virtual-document.js'
import { TextDocument } from '../text-document.js'

export class HtmlDocument extends TextDocument {
  constructor(
    virtualDocument: VirtualDocument,
    public rootNodes: HtmlNode[]
  ) {
    super(virtualDocument)
  }

  htmlAttrAreaAtOffset(offset: DocumentOffset | DocumentRange): HtmlNode | undefined {
    return this.mapFindOne((node) => {
      const offsetNum = typeof offset === 'number' ? offset : offset.end
      if (offsetNum > node.location.name.end && intersects(offset, node.location.startTag)) {
        // Check if the position intersects any attributes. Break if so.
        for (const htmlAttr of node.attributes) {
          if (intersects(offset, htmlAttr.location)) {
            return undefined
          }
        }

        return node
      }
      return
    })
  }

  htmlAttrAssignmentAtOffset(offset: DocumentOffset | DocumentRange): HtmlNodeAttr | undefined {
    return this.findAttr((attr) =>
      attr.assignment != null && attr.assignment.location != null ? intersects(offset, attr.assignment.location) : false
    )
  }

  htmlAttrNameAtOffset(offset: DocumentOffset | DocumentRange): HtmlNodeAttr | undefined {
    return this.findAttr((attr) => intersects(offset, attr.location.name))
  }

  htmlNodeNameAtOffset(offset: DocumentOffset | DocumentRange): HtmlNode | undefined {
    return this.findNode(
      (node) =>
        intersects(offset, node.location.name) ||
        (node.location.endTag != null && intersects(offset, node.location.endTag))
    )
  }

  htmlNodeOrAttrAtOffset(offset: DocumentOffset | DocumentRange): HtmlNode | HtmlNodeAttr | undefined {
    const htmlNode = this.htmlNodeNameAtOffset(offset)
    if (htmlNode != null) return htmlNode

    const htmlAttr = this.htmlAttrNameAtOffset(offset)
    if (htmlAttr != null) return htmlAttr
    return
  }

  /**
   * Finds the closest node to offset.
   * This method can be used to find out which tag to close in the HTML.
   * @param offset
   */
  htmlNodeClosestToOffset(offset: DocumentOffset): HtmlNode | undefined {
    let closestNode: HtmlNode | undefined = undefined

    // Use 'findNode' to iterate nodes. Keep track of the closest node.
    this.findNode((node) => {
      if (offset < node.location.startTag.end) {
        // Break as soon as we find a node that starts AFTER the offset.
        // The closestNode would now be the previous found node.
        return true
      } else if (node.location.endTag == null || offset < node.location.endTag.end) {
        // Save closest node if the node doesn't have an end tag of the node ends AFTER the offset.
        closestNode = node
      }
      return false
    })

    return closestNode
  }

  findAttr(test: (node: HtmlNodeAttr) => boolean): HtmlNodeAttr | undefined {
    return this.mapFindOne((node) => {
      for (const attr of node.attributes) {
        if (test(attr)) return attr
      }
      return
    })
  }

  findNode(test: (node: HtmlNode) => boolean): HtmlNode | undefined {
    return this.mapFindOne((node) => {
      if (test(node)) return node
      return
    })
  }

  mapNodes<T>(map: (node: HtmlNode) => T): T[] {
    const items: T[] = []

    function childrenLoop(node: HtmlNode) {
      items.push(map(node))
      node.children.forEach((childNode) => childrenLoop(childNode))
    }

    this.rootNodes.forEach((rootNode) => childrenLoop(rootNode))

    return items
  }

  *nodes(roots = this.rootNodes): IterableIterator<HtmlNode> {
    for (const root of roots) {
      yield root
      yield* this.nodes(root.children)
    }
  }

  private mapFindOne<T>(map: (node: HtmlNode) => T | undefined): T | undefined {
    for (const node of this.nodes()) {
      const found = map(node)
      if (found != null) {
        return found
      }
    }
    return
  }
}
