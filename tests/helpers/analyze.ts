import ts, { Program, SourceFile } from 'typescript'

import { DefaultLitAnalyzerContext } from '../../src/analyze/default-lit-analyzer-context.js'
import { LitIndexEntry } from '../../src/analyze/document-analyzer/html/lit-html-document-analyzer.js'
import { LitAnalyzerConfig, makeConfig } from '../../src/analyze/lit-analyzer-config.js'
import { LitAnalyzerContext } from '../../src/analyze/lit-analyzer-context.js'
import { LitAnalyzer } from '../../src/analyze/lit-analyzer.js'
import { LitCodeFix } from '../../src/analyze/types/lit-code-fix.js'
import { LitDiagnostic } from '../../src/analyze/types/lit-diagnostic.js'
import { Range } from '../../src/analyze/types/range.js'

import { compileFiles, TestFile } from './compile.js'

/**
 * Prepares both the Typescript program and the LitAnalyzer
 * @param inputFiles
 * @param config
 */
export function prepareAnalyzer(
  inputFiles: TestFile[] | TestFile,
  config: Partial<LitAnalyzerConfig> = {}
): { analyzer: LitAnalyzer; program: Program; sourceFile: SourceFile; context: LitAnalyzerContext } {
  const { program, sourceFile } = compileFiles(inputFiles)
  const context = new DefaultLitAnalyzerContext({
    ts,
    getProgram(): Program {
      return program
    },
  })

  const analyzer = new LitAnalyzer(context)

  context.updateConfig(makeConfig(config))

  return {
    analyzer,
    program,
    sourceFile,
    context,
  }
}

/**
 * Returns diagnostics in 'virtual' files using the LitAnalyzer
 * @param inputFiles
 * @param config
 */
export function getDiagnostics(
  inputFiles: TestFile[] | TestFile,
  config: Partial<LitAnalyzerConfig> = {}
): { diagnostics: LitDiagnostic[]; program: Program; sourceFile: SourceFile } {
  const { analyzer, sourceFile, program } = prepareAnalyzer(inputFiles, config)

  return {
    diagnostics: analyzer.getDiagnosticsInFile(sourceFile),
    program,
    sourceFile,
  }
}

/**
 * Returns code fixes in 'virtual' files using the LitAnalyzer
 * @param inputFiles
 * @param range
 * @param config
 */
export function getCodeFixesAtRange(
  inputFiles: TestFile[] | TestFile,
  range: Range,
  config: Partial<LitAnalyzerConfig> = {}
): { codeFixes: LitCodeFix[]; program: Program; sourceFile: SourceFile } {
  const { analyzer, sourceFile, program } = prepareAnalyzer(inputFiles, config)

  return {
    codeFixes: analyzer.getCodeFixesAtPositionRange(sourceFile, range),
    program,
    sourceFile,
  }
}

/**
 * @param inputFiles
 * @param config
 */
export function getIndexEntries(
  inputFiles: TestFile[] | TestFile,
  config: Partial<LitAnalyzerConfig> = {}
): { indexEntries: IterableIterator<LitIndexEntry>; program: Program; sourceFile: SourceFile } {
  const { analyzer, sourceFile, program } = prepareAnalyzer(inputFiles, config)

  return {
    indexEntries: analyzer.indexFile(sourceFile),
    program,
    sourceFile,
  }
}
