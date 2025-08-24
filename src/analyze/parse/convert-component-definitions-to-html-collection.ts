import {
  AnalyzerResult,
  ComponentDeclaration,
  ComponentDefinition,
  ComponentFeatures,
} from '@jarrodek/web-component-analyzer'
import { isSimpleType, SimpleType, SimpleTypeAny, toSimpleType } from 'ts-simple-type'
import { TypeChecker } from 'typescript'
import { lazy } from '../util/general-util.js'
import { HtmlDataCollection, HtmlDataFeatures, HtmlTag } from './parse-html-data/html-tag.js'

export interface AnalyzeResultConversionOptions {
  addDeclarationPropertiesAsAttributes?: boolean
  checker: TypeChecker
}

export function convertAnalyzeResultToHtmlCollection(
  result: AnalyzerResult,
  options: AnalyzeResultConversionOptions
): HtmlDataCollection {
  const tags = result.componentDefinitions.map((definition) =>
    convertComponentDeclarationToHtmlTag(definition.declaration, definition, options)
  )

  const global =
    result.globalFeatures == null
      ? {}
      : convertComponentFeaturesToHtml(result.globalFeatures, { checker: options.checker })

  return {
    tags,
    global,
  }
}

export function convertComponentDeclarationToHtmlTag(
  declaration: ComponentDeclaration | undefined,
  definition: ComponentDefinition | undefined,
  { checker, addDeclarationPropertiesAsAttributes }: AnalyzeResultConversionOptions
): HtmlTag {
  const tagName = definition?.tagName ?? ''

  const builtIn =
    definition == null || (declaration?.sourceFile || definition.sourceFile).fileName.endsWith('lib.dom.d.ts')

  if (declaration == null) {
    return {
      tagName,
      builtIn,
      attributes: [],
      events: [],
      properties: [],
      slots: [],
      cssParts: [],
      cssProperties: [],
    }
  }

  const description = declaration.jsDoc?.description
  const htmlTag: HtmlTag = {
    declaration,
    tagName,
    builtIn,
    ...(description != null ? { description } : {}),
    ...convertComponentFeaturesToHtml(declaration, { checker, builtIn, fromTagName: tagName }),
  }

  if (addDeclarationPropertiesAsAttributes && !builtIn) {
    for (const htmlProp of htmlTag.properties) {
      if (
        htmlProp.declaration != null &&
        htmlProp.declaration.attrName == null &&
        htmlProp.declaration.node.getSourceFile().isDeclarationFile
      ) {
        htmlTag.attributes.push({
          ...htmlProp,
          kind: 'attribute',
        })
      }
    }
  }

  return htmlTag
}

export function convertComponentFeaturesToHtml(
  features: ComponentFeatures,
  { checker, builtIn, fromTagName }: { checker: TypeChecker; builtIn?: boolean; fromTagName?: string }
): HtmlDataFeatures {
  const result: HtmlDataFeatures = {
    attributes: [],
    events: [],
    properties: [],
    slots: [],
    cssParts: [],
    cssProperties: [],
  }

  for (const event of features.events) {
    const description = event.jsDoc?.description
    result.events.push({
      declaration: event,
      ...(description != null ? { description } : {}),
      name: event.name,
      getType: lazy(() => {
        const type = event.type?.()

        if (type == null) {
          return { kind: 'ANY' }
        }

        return isSimpleType(type) ? type : toSimpleType(type, checker)
      }),
      ...(fromTagName != null ? { fromTagName } : {}),
      ...(builtIn != null ? { builtIn } : {}),
    })

    const jsDoc = event.jsDoc
    result.attributes.push({
      kind: 'attribute',
      name: `on${event.name}`,
      ...(description != null ? { description } : {}),
      getType: lazy(() => ({ kind: 'STRING' }) as SimpleType),
      declaration: {
        attrName: `on${event.name}`,
        ...(jsDoc != null ? { jsDoc } : {}),
        kind: 'attribute',
        node: event.node,
        type: () => ({ kind: 'ANY' }),
      },
      ...(builtIn != null ? { builtIn } : {}),
      ...(fromTagName != null ? { fromTagName } : {}),
    })
  }

  for (const cssPart of features.cssParts) {
    const description = cssPart.jsDoc?.description
    result.cssParts.push({
      declaration: cssPart,
      ...(description != null ? { description } : {}),
      name: cssPart.name || '',
      ...(fromTagName != null ? { fromTagName } : {}),
    })
  }

  for (const cssProp of features.cssProperties) {
    const description = cssProp.jsDoc?.description
    const typeHint = cssProp.typeHint
    result.cssProperties.push({
      declaration: cssProp,
      ...(description != null ? { description } : {}),
      name: cssProp.name || '',
      ...(typeHint != null ? { typeHint } : {}),
      ...(fromTagName != null ? { fromTagName } : {}),
    })
  }

  for (const slot of features.slots) {
    const description = slot.jsDoc?.description
    result.slots.push({
      declaration: slot,
      ...(description != null ? { description } : {}),
      name: slot.name || '',
      ...(fromTagName != null ? { fromTagName } : {}),
    })
  }

  for (const member of features.members) {
    // Only add public members
    if (member.visibility != null && member.visibility !== 'public') {
      continue
    }

    // Only add non-static members
    if (member.modifiers?.has('static')) {
      continue
    }

    // Only add writable members
    if (member.modifiers?.has('readonly')) {
      continue
    }

    const description = member.jsDoc?.description
    const base = {
      declaration: member,
      ...(description != null ? { description } : {}),
      getType: lazy(() => {
        const type = member.type?.()

        if (type == null) {
          return { kind: 'ANY' } as SimpleTypeAny
        }

        return isSimpleType(type) ? type : toSimpleType(type, checker)
      }),
      ...(builtIn != null ? { builtIn } : {}),
      ...(fromTagName != null ? { fromTagName } : {}),
    }

    if (member.kind === 'property') {
      const required = member.required
      result.properties.push({
        ...base,
        kind: 'property',
        name: member.propName,
        ...(required != null ? { required } : {}),
      })
    }

    if ('attrName' in member && member.attrName != null) {
      const required = member.required
      result.attributes.push({
        ...base,
        kind: 'attribute',
        name: member.attrName,
        ...(required != null ? { required } : {}),
      })
    }
  }

  return result
}
