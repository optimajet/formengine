/* eslint-disable no-console */

import {writeFileSync} from 'fs'
import {join} from 'path'
import type {BundleInfo} from './tool.ts'
import {formatSize} from './utils.ts'
import {calculateDuplicateSizes, escapeCsvValue, processChunks} from './report-common.ts'

/**
 * Exports bundle size results to CSV format.
 * @param allResults bundle info results
 * @param apps list of app names
 * @param variants list of variant names
 * @param activeBuildTools list of active build tools
 * @param statsDir directory to save CSV files
 */
export function exportToCSV(
  allResults: BundleInfo[],
  apps: readonly string[],
  variants: readonly string[],
  activeBuildTools: readonly string[],
  statsDir: string
): void {
  if (allResults.length === 0) {
    return
  }

  // Summary CSV: App, Variant, Build Tool (if multiple), Total Size (bytes), Total Size (formatted), Chunk Count, Code, CSS, Duplicate Count, Wasted Size
  const hasMultipleTools = activeBuildTools.length > 1
  const summaryHeader = hasMultipleTools
    ? 'App,Variant,Build Tool,Total Size (bytes),Total Size (formatted),Chunk Count,Code (bytes),Code (formatted),CSS (bytes),CSS (formatted),Duplicate Count,Wasted Size (bytes),Wasted Size (formatted)'
    : 'App,Variant,Total Size (bytes),Total Size (formatted),Chunk Count,Code (bytes),Code (formatted),CSS (bytes),CSS (formatted),Duplicate Count,Wasted Size (bytes),Wasted Size (formatted)'
  const summaryLines: string[] = [summaryHeader]

  for (const result of allResults.sort((a, b) => {
    const appCompare = a.app.localeCompare(b.app)
    if (appCompare !== 0) return appCompare
    const variantCompare = a.variant.localeCompare(b.variant)
    if (variantCompare !== 0) return variantCompare
    return a.buildTool.localeCompare(b.buildTool)
  })) {
    const chunkCount = Object.keys(result.chunks).length
    if (hasMultipleTools) {
      summaryLines.push(
        `${escapeCsvValue(result.app)},${escapeCsvValue(result.variant)},${escapeCsvValue(result.buildTool)},${result.totalSize},${escapeCsvValue(formatSize(result.totalSize))},${chunkCount},${result.breakdown.code},${escapeCsvValue(formatSize(result.breakdown.code))},${result.breakdown.css},${escapeCsvValue(formatSize(result.breakdown.css))},${result.duplicates.duplicateCount},${result.duplicates.totalDuplicateSize},${escapeCsvValue(formatSize(result.duplicates.totalDuplicateSize))}`
      )
    } else {
      summaryLines.push(
        `${escapeCsvValue(result.app)},${escapeCsvValue(result.variant)},${result.totalSize},${escapeCsvValue(formatSize(result.totalSize))},${chunkCount},${result.breakdown.code},${escapeCsvValue(formatSize(result.breakdown.code))},${result.breakdown.css},${escapeCsvValue(formatSize(result.breakdown.css))},${result.duplicates.duplicateCount},${result.duplicates.totalDuplicateSize},${escapeCsvValue(formatSize(result.duplicates.totalDuplicateSize))}`
      )
    }
  }

  const summaryCsvPath = join(statsDir, 'bundle-sizes-summary.csv')
  writeFileSync(summaryCsvPath, summaryLines.join('\n') + '\n', 'utf-8')
  console.log(`📄 Summary CSV exported to: ${summaryCsvPath}`)

  // Detailed chunks CSV: App, Variant, Build Tool (if multiple), Chunk Name, Chunk Size (bytes), Chunk Size (formatted)
  const chunksHeader = hasMultipleTools
    ? 'App,Variant,Build Tool,Chunk Name,Chunk Size (bytes),Chunk Size (formatted)'
    : 'App,Variant,Chunk Name,Chunk Size (bytes),Chunk Size (formatted)'
  const chunksLines: string[] = [chunksHeader]

  for (const result of allResults.sort((a, b) => {
    const appCompare = a.app.localeCompare(b.app)
    if (appCompare !== 0) return appCompare
    const variantCompare = a.variant.localeCompare(b.variant)
    if (variantCompare !== 0) return variantCompare
    return a.buildTool.localeCompare(b.buildTool)
  })) {
    const chunks = processChunks(result.chunks)

    for (const chunk of chunks) {
      if (hasMultipleTools) {
        chunksLines.push(
          `${escapeCsvValue(result.app)},${escapeCsvValue(result.variant)},${escapeCsvValue(result.buildTool)},${escapeCsvValue(chunk.name)},${chunk.size},${escapeCsvValue(formatSize(chunk.size))}`
        )
      } else {
        chunksLines.push(
          `${escapeCsvValue(result.app)},${escapeCsvValue(result.variant)},${escapeCsvValue(chunk.name)},${chunk.size},${escapeCsvValue(formatSize(chunk.size))}`
        )
      }
    }
  }

  const chunksCsvPath = join(statsDir, 'bundle-sizes-chunks.csv')
  writeFileSync(chunksCsvPath, chunksLines.join('\n') + '\n', 'utf-8')
  console.log(`📄 Detailed chunks CSV exported to: ${chunksCsvPath}`)

  // Summary matrix CSV: App vs Variant matrix (one per build tool if multiple)
  if (activeBuildTools.length > 1) {
    for (const tool of activeBuildTools) {
      const matrixLines: string[] = []
      const matrixHeader = ['App', ...variants.map(v => escapeCsvValue(v))].join(',')
      matrixLines.push(matrixHeader)

      for (const app of apps) {
        const row: string[] = [escapeCsvValue(app)]
        for (const variant of variants) {
          const info = allResults.find(r => r.app === app && r.variant === variant && r.buildTool === tool)
          row.push(info ? escapeCsvValue(formatSize(info.totalSize)) : 'N/A')
        }
        matrixLines.push(row.join(','))
      }

      const matrixCsvPath = join(statsDir, `bundle-sizes-matrix-${tool}.csv`)
      writeFileSync(matrixCsvPath, matrixLines.join('\n') + '\n', 'utf-8')
      console.log(`📄 Summary matrix CSV (${tool}) exported to: ${matrixCsvPath}`)
    }
  } else {
    const matrixLines: string[] = []
    const matrixHeader = ['App', ...variants.map(v => escapeCsvValue(v))].join(',')
    matrixLines.push(matrixHeader)

    for (const app of apps) {
      const row: string[] = [escapeCsvValue(app)]
      for (const variant of variants) {
        const info = allResults.find(r => r.app === app && r.variant === variant)
        row.push(info ? escapeCsvValue(formatSize(info.totalSize)) : 'N/A')
      }
      matrixLines.push(row.join(','))
    }

    const matrixCsvPath = join(statsDir, 'bundle-sizes-matrix.csv')
    writeFileSync(matrixCsvPath, matrixLines.join('\n') + '\n', 'utf-8')
    console.log(`📄 Summary matrix CSV exported to: ${matrixCsvPath}`)
  }

  // Duplicate packages CSV: App, Variant, Build Tool (if multiple), Package Name, Occurrences, Total Size, Wasted Size, Chunks
  const duplicatesHeader = hasMultipleTools
    ? 'App,Variant,Build Tool,Package Name,Occurrences,Total Size (bytes),Total Size (formatted),Wasted Size (bytes),Wasted Size (formatted),Chunks'
    : 'App,Variant,Package Name,Occurrences,Total Size (bytes),Total Size (formatted),Wasted Size (bytes),Wasted Size (formatted),Chunks'
  const duplicatesLines: string[] = [duplicatesHeader]

  for (const result of allResults.sort((a, b) => {
    const appCompare = a.app.localeCompare(b.app)
    if (appCompare !== 0) return appCompare
    const variantCompare = a.variant.localeCompare(b.variant)
    if (variantCompare !== 0) return variantCompare
    return a.buildTool.localeCompare(b.buildTool)
  })) {
    for (const dup of result.duplicates.packages) {
      const {wastedSize} = calculateDuplicateSizes(dup.totalSize, dup.occurrences)
      const chunksList = dup.chunks.join(';')
      if (hasMultipleTools) {
        duplicatesLines.push(
          `${escapeCsvValue(result.app)},${escapeCsvValue(result.variant)},${escapeCsvValue(result.buildTool)},${escapeCsvValue(dup.packageName)},${dup.occurrences},${dup.totalSize},${escapeCsvValue(formatSize(dup.totalSize))},${wastedSize},${escapeCsvValue(formatSize(wastedSize))},${escapeCsvValue(chunksList)}`
        )
      } else {
        duplicatesLines.push(
          `${escapeCsvValue(result.app)},${escapeCsvValue(result.variant)},${escapeCsvValue(dup.packageName)},${dup.occurrences},${dup.totalSize},${escapeCsvValue(formatSize(dup.totalSize))},${wastedSize},${escapeCsvValue(formatSize(wastedSize))},${escapeCsvValue(chunksList)}`
        )
      }
    }
  }

  const duplicatesCsvPath = join(statsDir, 'bundle-sizes-duplicates.csv')
  writeFileSync(duplicatesCsvPath, duplicatesLines.join('\n') + '\n', 'utf-8')
  console.log(`📄 Duplicate packages CSV exported to: ${duplicatesCsvPath}`)
  console.log('')
}
