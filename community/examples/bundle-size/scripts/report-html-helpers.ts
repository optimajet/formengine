import {type AppType, calculateMatrixCellComparison, formatDiffKB, generateVariantLabelCommon} from './report-common.ts'
import {escapeHtml, generateMatrixCell, generateMatrixCellNA} from './report-html-templates.ts'
import type {BundleInfo} from './tool.ts'
import {formatSizeWithCompressionHTML} from './utils.ts'

/**
 * Generates a detail ID for a bundle result.
 * @param app app name
 * @param variant variant name
 * @param buildTool build tool name
 * @param hasMultipleTools whether multiple build tools are used
 * @returns detail ID string
 */
export function generateDetailId(app: string, variant: string, buildTool: string, hasMultipleTools: boolean): string {
  return hasMultipleTools ? `detail-${app}-${variant}-${buildTool}` : `detail-${app}-${variant}`
}

/**
 * Generates a pie chart ID for a bundle result.
 * @param app app name
 * @param variant variant name
 * @param buildTool build tool name
 * @param hasMultipleTools whether multiple build tools are used
 * @returns pie chart ID string
 */
export function generatePieChartId(app: string, variant: string, buildTool: string, hasMultipleTools: boolean): string {
  return hasMultipleTools ? `pie-${app}-${variant}-${buildTool}` : `pie-${app}-${variant}`
}

/**
 * Generates a variant label for display.
 * @param variant variant name
 * @param buildTool build tool name
 * @param hasMultipleTools whether multiple build tools are used
 * @returns variant label string
 */
export function generateVariantLabel(variant: string, buildTool: string, hasMultipleTools: boolean): string {
  return generateVariantLabelCommon(variant, buildTool, hasMultipleTools, escapeHtml)
}

/**
 * Generates a matrix cell for a variant/app combination.
 * @param info bundle info (or null/undefined if not found)
 * @param colIndex column index
 * @param columnMins column minimums data
 * @param appIndex app index
 * @returns matrix cell HTML string
 */
export function generateMatrixCellForVariant(
  info: BundleInfo | null | undefined,
  colIndex: number,
  columnMins: Array<{value: number; gzipValue: number; rowIndex: number}>,
  appIndex: number
): string {
  if (!info) {
    return generateMatrixCellNA()
  }
  const {isSmallest, diffToMin, diffGzipToMin} = calculateMatrixCellComparison(info, colIndex, columnMins, appIndex)
  const value = formatSizeWithCompressionHTML(info.totalSize, info.totalSizeGzip)
  const cellClass = isSmallest ? ' class="smallest"' : ''
  const diffHint = `<br/><span class="diff-hint" title="Difference to smallest variant: ${formatDiffKB(
    diffToMin,
    diffGzipToMin
  )}">(${formatDiffKB(diffToMin, diffGzipToMin)})</span>`
  return generateMatrixCell(value, diffHint, cellClass)
}

/**
 * Generates an app link HTML string.
 * @param app app name
 * @param getAppName function to get the display name for the app
 * @returns app link HTML string
 */
export function generateAppLink(app: AppType, getAppName: (app: AppType) => string): string {
  const appName = getAppName(app)
  return `<a href="#app-${app}">${escapeHtml(appName)}</a>`
}
