import { AnalyzerResult, ComponentDeclaration, ComponentDefinition } from '@jarrodek/web-component-analyzer'
import { SourceFile } from 'typescript'

export interface AnalyzerDefinitionStore {
  getAnalysisResultForFile(sourceFile: SourceFile): AnalyzerResult | undefined
  getDefinitionsWithDeclarationInFile(sourceFile: SourceFile): ComponentDefinition[]
  getComponentDeclarationsInFile(sourceFile: SourceFile): ComponentDeclaration[]
  getDefinitionForTagName(tagName: string): ComponentDefinition | undefined
  getDefinitionsInFile(sourceFile: SourceFile): ComponentDefinition[]
}
