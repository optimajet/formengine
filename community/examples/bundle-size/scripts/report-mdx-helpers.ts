import {calculateMatrixCellComparison, formatDiffKB, generateVariantLabelCommon} from './report-common.ts'
import type {BundleInfo} from './tool.ts'
import {formatSize, formatSizeWithCompression} from './utils.ts'

/**
 * Escapes markdown special characters.
 * @param value value to escape
 * @returns escaped markdown string
 */
export function escapeMarkdown(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

/**
 * Converts a string to a valid JavaScript identifier (camelCase).
 * @param str string to convert
 * @returns valid camelCase identifier
 */
export function toValidIdentifier(str: string): string {
  const camelCase = str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toLowerCase() + word.slice(1).toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join('')
  return /^[a-zA-Z]/.test(camelCase) ? camelCase : `chart${camelCase}`
}

/**
 * Generates a variant label for display.
 * @param variant variant name
 * @param buildTool build tool name
 * @param hasMultipleTools whether multiple build tools are used
 * @returns variant label string
 */
export function generateVariantLabel(variant: string, buildTool: string, hasMultipleTools: boolean): string {
  return generateVariantLabelCommon(variant, buildTool, hasMultipleTools)
}

/**
 * Generates a matrix cell value for markdown table.
 * @param info bundle info (or null if not found)
 * @param colIndex column index
 * @param columnMins column minimums data
 * @param appIndex app index
 * @returns formatted cell value string
 */
export function generateMatrixCellValue(
  info: BundleInfo | null,
  colIndex: number,
  columnMins: Array<{value: number; gzipValue: number; rowIndex: number}>,
  appIndex: number
): string {
  if (!info) {
    return 'N/A'
  }
  const {isSmallest, diffToMin, diffGzipToMin} = calculateMatrixCellComparison(info, colIndex, columnMins, appIndex)
  const value = formatSizeWithCompression(info.totalSize, info.totalSizeGzip)
  const diffHint = ` (${formatDiffKB(diffToMin, diffGzipToMin)})`
  const escapedValue = escapeMarkdown(value)
  const escapedDiffHint = escapeMarkdown(diffHint)
  // Use HTML span with green background for smallest values in Summary Matrix tables
  // Note: Can't nest markdown bold (**) inside HTML, so using <strong> tag instead
  return isSmallest
    ? `<span style={{backgroundColor: '#e8f5e9', padding: '2px 4px', borderRadius: '3px'}}><strong>${escapedValue}${escapedDiffHint}</strong></span>`
    : `${escapedValue}${escapedDiffHint}`
}

/**
 * Generates a table header row for app comparison.
 * @param hasMultipleTools whether multiple build tools are used
 * @param hasDuplicates whether to include duplicate columns
 * @returns table header string
 */
export function generateAppTableHeader(hasMultipleTools: boolean, hasDuplicates: boolean = true): string {
  const duplicateCols = hasDuplicates ? ' | Duplicates | Wasted Size' : ''
  return hasMultipleTools
    ? `| Variant | Build Tool | Total Size<sub>(raw/gzip)</sub> | Chunks | Code<sub>(raw/gzip)</sub> | CSS<sub>(raw/gzip)</sub>${duplicateCols} |`
    : `| Variant | Total Size<sub>(raw/gzip)</sub> | Chunks | Code<sub>(raw/gzip)</sub> | CSS<sub>(raw/gzip)</sub>${duplicateCols} |`
}

/**
 * Generates a table separator row for app comparison.
 * @param hasMultipleTools whether multiple build tools are used
 * @param hasDuplicates whether to include duplicate columns
 * @returns table separator string
 */
export function generateAppTableSeparator(hasMultipleTools: boolean, hasDuplicates: boolean = true): string {
  const duplicateCols = hasDuplicates ? ' | --- | ---' : ''
  return hasMultipleTools ? `| --- | --- | --- | --- | --- | ---${duplicateCols} |` : `| --- | --- | --- | --- | ---${duplicateCols} |`
}

/**
 * Generates a table row for app comparison with multiple tools.
 * @param result bundle result
 * @param chunkCount number of chunks
 * @param hasDuplicates whether to include duplicate columns
 * @returns table row string
 */
export function generateAppTableRowMultipleTools(result: BundleInfo, chunkCount: number, hasDuplicates: boolean = true): string {
  const duplicateCols = hasDuplicates
    ? ` | ${result.duplicates.duplicateCount} | ${escapeMarkdown(formatSize(result.duplicates.totalDuplicateSize))}`
    : ''
  return `| ${escapeMarkdown(result.variant)} | ${escapeMarkdown(result.buildTool)} | ${escapeMarkdown(formatSizeWithCompression(result.totalSize, result.totalSizeGzip))} | ${chunkCount} | ${escapeMarkdown(formatSizeWithCompression(result.breakdown.code, result.breakdownGzip?.code))} | ${escapeMarkdown(formatSizeWithCompression(result.breakdown.css, result.breakdownGzip?.css))}${duplicateCols} |`
}

/**
 * Generates a table row for app comparison without multiple tools.
 * @param result bundle result
 * @param chunkCount number of chunks
 * @param hasDuplicates whether to include duplicate columns
 * @returns table row string
 */
export function generateAppTableRowSingleTool(result: BundleInfo, chunkCount: number, hasDuplicates: boolean = true): string {
  const duplicateCols = hasDuplicates
    ? ` | ${result.duplicates.duplicateCount} | ${escapeMarkdown(formatSize(result.duplicates.totalDuplicateSize))}`
    : ''
  return `| ${escapeMarkdown(result.variant)} | ${escapeMarkdown(formatSizeWithCompression(result.totalSize, result.totalSizeGzip))} | ${chunkCount} | ${escapeMarkdown(formatSizeWithCompression(result.breakdown.code, result.breakdownGzip?.code))} | ${escapeMarkdown(formatSizeWithCompression(result.breakdown.css, result.breakdownGzip?.css))}${duplicateCols} |`
}

/**
 * Generates a table header row for variant comparison.
 * @param hasMultipleTools whether multiple build tools are used
 * @param hasDuplicates whether to include duplicate columns
 * @returns table header string
 */
export function generateVariantTableHeader(hasMultipleTools: boolean, hasDuplicates: boolean = true): string {
  const duplicateCols = hasDuplicates ? ' | Duplicates | Wasted Size' : ''
  return hasMultipleTools
    ? `| App | Build Tool | Total Size<sub>(raw/gzip)</sub> | Chunks | Code<sub>(raw/gzip)</sub> | CSS<sub>(raw/gzip)</sub>${duplicateCols} |`
    : `| App | Total Size<sub>(raw/gzip)</sub> | Chunks | Code<sub>(raw/gzip)</sub> | CSS<sub>(raw/gzip)</sub>${duplicateCols} |`
}

/**
 * Generates a table separator row for variant comparison.
 * @param hasMultipleTools whether multiple build tools are used
 * @param hasDuplicates whether to include duplicate columns
 * @returns table separator string
 */
export function generateVariantTableSeparator(hasMultipleTools: boolean, hasDuplicates: boolean = true): string {
  const duplicateCols = hasDuplicates ? ' | --- | ---' : ''
  return hasMultipleTools ? `| --- | --- | --- | --- | --- | ---${duplicateCols} |` : `| --- | --- | --- | --- | ---${duplicateCols} |`
}

/**
 * Generates formatted value with bold if it's the smallest.
 * @param value value to format
 * @param isSmallest whether this is the smallest value
 * @returns formatted string
 */
export function formatSmallestValue(value: string, isSmallest: boolean): string {
  return isSmallest ? `**${value}**` : value
}

/**
 * Generates a table row for variant comparison with multiple tools.
 * @param result bundle result
 * @param chunkCount number of chunks
 * @param totalSizeFormatted formatted total size
 * @param codeFormatted formatted code size
 * @param cssFormatted formatted CSS size
 * @param wastedFormatted formatted wasted size
 * @param hasDuplicates whether to include duplicate columns
 * @returns table row string
 */
export function generateVariantTableRowMultipleTools(
  appLabel: string,
  result: BundleInfo,
  chunkCount: number,
  totalSizeFormatted: string,
  codeFormatted: string,
  cssFormatted: string,
  wastedFormatted: string,
  hasDuplicates: boolean = true
): string {
  const duplicateCols = hasDuplicates ? ` | ${result.duplicates.duplicateCount} | ${wastedFormatted}` : ''
  return `| **${escapeMarkdown(appLabel)}** | ${escapeMarkdown(result.buildTool)} | ${totalSizeFormatted} | ${chunkCount} | ${codeFormatted} | ${cssFormatted}${duplicateCols} |`
}

/**
 * Generates a table row for variant comparison without multiple tools.
 * @param result bundle result
 * @param chunkCount number of chunks
 * @param totalSizeFormatted formatted total size
 * @param codeFormatted formatted code size
 * @param cssFormatted formatted CSS size
 * @param wastedFormatted formatted wasted size
 * @param hasDuplicates whether to include duplicate columns
 * @returns table row string
 */
export function generateVariantTableRowSingleTool(
  appLabel: string,
  result: BundleInfo,
  chunkCount: number,
  totalSizeFormatted: string,
  codeFormatted: string,
  cssFormatted: string,
  wastedFormatted: string,
  hasDuplicates: boolean = true
): string {
  const duplicateCols = hasDuplicates ? ` | ${result.duplicates.duplicateCount} | ${wastedFormatted}` : ''
  return `| **${escapeMarkdown(appLabel)}** | ${totalSizeFormatted} | ${chunkCount} | ${codeFormatted} | ${cssFormatted}${duplicateCols} |`
}

/**
 * Generates a pie chart file name.
 * @param app app name
 * @param variant variant name
 * @param buildTool build tool name
 * @param hasMultipleTools whether multiple build tools are used
 * @param suffix optional suffix (e.g., 'gzip')
 * @returns file name string
 */
export function generatePieChartFileName(
  app: string,
  variant: string,
  buildTool: string,
  hasMultipleTools: boolean,
  suffix?: string
): string {
  const baseName = hasMultipleTools ? `pie-${app}-${variant}-${buildTool}` : `pie-${app}-${variant}`
  return suffix ? `${baseName}-${suffix}.json` : `${baseName}.json`
}
