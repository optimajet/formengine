/* eslint-disable no-console */

import {existsSync, mkdirSync, writeFileSync} from 'fs'
import {join} from 'path'
import {BASELINE_INITIAL_RENDER_MS, CSS_PARSE_TIME_PER_KB, JS_PARSE_TIME_PER_KB} from './performance-constants.ts'
import type {BundleBreakdown, BundleInfo} from './tool.ts'
import {calculatePercentage} from './tool.ts'
import {formatSize} from './utils.ts'

export const apps = ['formengine', 'rjsf', 'survey', 'vueform'] as const
export const variants = ['login', 'login-mui', 'booking', 'booking-mui'] as const

export type AppType = typeof apps[number]

const mapLibTitleNonMui: Record<AppType, string> = {
  'formengine': 'FormEngine Rsuite',
  'rjsf': 'RJSF',
  'vueform': 'VueForm',
  'survey': 'SurveyJS'
}

const mapLibTitleMui: Record<AppType, string> = {
  'formengine': 'FormEngine MUI',
  'rjsf': 'RJSF',
  'vueform': 'VueForm',
  'survey': 'SurveyJS'
}

const mapLibTitle: Record<AppType, string> = {
  'formengine': 'FormEngine Core',
  'rjsf': 'RJSF',
  'vueform': 'VueForm',
  'survey': 'SurveyJS'
}

export function getLibTitle(app: AppType): string {
  return mapLibTitle[app]
}

/**
 * Escapes CSV value by wrapping in quotes if needed.
 * @param value value to escape
 * @returns escaped CSV value
 */
export function escapeCsvValue(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Saves SVG content to a file.
 * @param svgContent SVG content as string
 * @param filePath path where to save the file
 */
export function saveSVGFile(svgContent: string, filePath: string): void {
  const dir = join(filePath, '..')
  if (!existsSync(dir)) {
    mkdirSync(dir, {recursive: true})
  }
  writeFileSync(filePath, svgContent, 'utf-8')
}

/**
 * Calculates performance metrics based on bundle size.
 * @param totalSizeGzip gzip compressed bundle size in bytes
 * @param codeSize JavaScript code size in bytes
 * @param cssSize CSS size in bytes
 * @param connectionSpeed connection speed in bytes per second
 * @returns performance metrics object
 */
export function calculatePerformanceMetrics(
  totalSizeGzip: number,
  codeSize: number,
  cssSize: number,
  connectionSpeed: number
): {downloadTime: number; parseTime: number; lcp: number; tti: number} {
  // Download time: total size / connection speed
  const downloadTime = (totalSizeGzip / connectionSpeed) * 1000 // Convert to ms

  // Parse time: JS parse + CSS parse
  const jsParseTime = (codeSize / 1024) * JS_PARSE_TIME_PER_KB
  const cssParseTime = (cssSize / 1024) * CSS_PARSE_TIME_PER_KB
  const parseTime = jsParseTime + cssParseTime

  // LCP (Largest Contentful Paint): download + CSS parse + baseline render
  const lcp = downloadTime + cssParseTime + BASELINE_INITIAL_RENDER_MS

  // TTI (Time to Interactive): LCP + full JS parse
  const tti = lcp + parseTime

  return {downloadTime, parseTime, lcp, tti}
}

/**
 * Generates a Vega-Lite JSON chart for performance metrics.
 * @param slow3GData performance data for slow 3G connection
 * @param avg4GData performance data for average 4G connection
 * @param variant variant name for title and file naming
 * @returns Vega-Lite chart JSON object
 */
export function generateVegaLiteChart(
  slow3GData: Array<{label: string; lcp: number; tti: number; parseTime: number}>,
  avg4GData: Array<{label: string; lcp: number; tti: number; parseTime: number}>,
  variant: string
): Record<string, unknown> | null {
  if (slow3GData.length === 0 && avg4GData.length === 0) return null

  // Get all unique labels (frameworks)
  const allLabels = Array.from(new Set([...slow3GData.map(d => d.label), ...avg4GData.map(d => d.label)]))

  // Build data array in Vega-Lite format
  const dataValues: Array<{framework: string; metric: string; value: number}> = []

  for (const label of allLabels) {
    const slow3GItem = slow3GData.find(d => d.label === label)
    const avg4GItem = avg4GData.find(d => d.label === label)

    if (slow3GItem) {
      dataValues.push(
        {framework: label, metric: '3G LCP', value: Math.round(slow3GItem.lcp)},
        {framework: label, metric: '3G TTI', value: Math.round(slow3GItem.tti)}
      )
    }
    if (avg4GItem) {
      dataValues.push(
        {framework: label, metric: '4G LCP', value: Math.round(avg4GItem.lcp)},
        {framework: label, metric: '4G TTI', value: Math.round(avg4GItem.tti)}
      )
    }

    // Parse time is averaged between 3G and 4G
    const parse3G = slow3GItem?.parseTime || 0
    const parse4G = avg4GItem?.parseTime || 0
    const parseTime = parse3G > 0 && parse4G > 0 ? Math.round((parse3G + parse4G) / 2) : Math.round(parse3G || parse4G)
    if (parseTime > 0) {
      dataValues.push({framework: label, metric: 'Parse', value: parseTime})
    }
  }

  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title: `Performance Comparison: ${variant} (Slow 3G vs Average 4G)`,
    data: {
      values: dataValues,
    },
    mark: {type: 'bar', cornerRadiusTopLeft: 2, cornerRadiusTopRight: 2},
    encoding: {
      x: {field: 'framework', type: 'nominal', axis: {labelAngle: -45}},
      y: {field: 'value', type: 'quantitative', title: 'Time (ms)'},
      xOffset: {
        field: 'metric',
        scale: {
          paddingInner: 0.1,
        },
      },
      color: {
        field: 'metric',
        scale: {
          domain: ['3G LCP', '4G LCP', '3G TTI', '4G TTI', 'Parse'],
          range: ['#2E7D32', '#4CAF50', '#1565C0', '#2196F3', '#FF9800'],
        },
      },
      tooltip: [
        {field: 'framework', type: 'nominal'},
        {field: 'metric', type: 'nominal'},
        {field: 'value', type: 'quantitative', format: ','},
      ],
    },
  }
}

/**
 * Generates a Vega-Lite JSON chart for pie chart (breakdown).
 * @param breakdown bundle breakdown with code and CSS sizes
 * @param totalSize total bundle size
 * @param app app name for title
 * @param variant variant name for title
 * @returns Vega-Lite chart JSON object
 */
export function generateVegaLitePieChart(
  breakdown: BundleBreakdown,
  _totalSize: number,
  app: string,
  variant: string,
  titleSuffix?: string
): Record<string, unknown> | null {
  const total = breakdown.code + breakdown.css
  if (total === 0) return null

  const dataValues: Array<{category: string; value: number}> = []
  if (breakdown.code > 0) {
    dataValues.push({category: 'Code', value: breakdown.code})
  }
  if (breakdown.css > 0) {
    dataValues.push({category: 'CSS', value: breakdown.css})
  }

  // Build color range based on categories present (Code first, then CSS)
  const colorRange: string[] = []
  const hasCode = dataValues.some(d => d.category === 'Code')
  const hasCss = dataValues.some(d => d.category === 'CSS')

  if (hasCode) {
    colorRange.push('#4CAF50')
  }
  if (hasCss) {
    colorRange.push('#2196F3')
  }

  const title = titleSuffix ? `${app} (${titleSuffix}) - ${variant}` : `${app} - ${variant}`

  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    title,
    data: {
      values: dataValues,
    },
    transform: [
      {
        joinaggregate: [{op: 'sum', field: 'value', as: 'total'}],
      },
      {
        calculate: 'datum.value / datum.total',
        as: 'pct',
      },
      {
        calculate: "datum.category + ' (' + format(datum.pct, '.2%') + ')'",
        as: 'categoryWithPct',
      },
    ],
    mark: {type: 'arc', innerRadius: 0, cornerRadius: 2},
    encoding: {
      theta: {field: 'value', type: 'quantitative'},
      color: {
        field: 'categoryWithPct',
        type: 'nominal',
        scale: {
          range: colorRange,
        },
        legend: {title: 'Category'},
      },
      tooltip: [
        {field: 'category', type: 'nominal'},
        {field: 'value', type: 'quantitative', format: ','},
        {field: 'pct', type: 'quantitative', format: '.2%'},
      ],
    },
  }
}

/**
 * Saves Vega-Lite chart JSON to a file.
 * @param vegaLiteChart Vega-Lite chart JSON object
 * @param filePath path where to save the file
 */
export function saveVegaLiteFile(vegaLiteChart: Record<string, unknown>, filePath: string): void {
  const dir = join(filePath, '..')
  if (!existsSync(dir)) {
    mkdirSync(dir, {recursive: true})
  }
  writeFileSync(filePath, JSON.stringify(vegaLiteChart, null, 2), 'utf-8')
}

// Track exported charts for summary message
let exportedChartsCount = 0

/**
 * Gets the current exported charts count.
 * @returns current count
 */
export function getExportedChartsCount(): number {
  return exportedChartsCount
}

/**
 * Increments the exported charts count.
 */
export function incrementExportedChartsCount(): void {
  exportedChartsCount++
}

/**
 * Resets the exported charts count.
 */
export function resetExportedChartsCount(): void {
  exportedChartsCount = 0
}

/**
 * Generates a pure SVG pie chart with legend for bundle breakdown.
 * @param breakdown bundle breakdown data
 * @param totalSize total bundle size for percentage calculations
 * @param app app name for title
 * @param variant variant name for title
 * @param buildTool build tool name (optional, for file naming)
 * @param statsDir directory to save chart files (optional)
 * @param chartSize chart size in pixels (default 220)
 * @returns complete SVG string with pie chart and legend
 */
export function generatePieChart(
  breakdown: BundleBreakdown,
  totalSize: number,
  app: string,
  variant: string,
  buildTool?: string,
  statsDir?: string,
  chartSize = 220
): string {
  const total = breakdown.code + breakdown.css
  if (total === 0) {
    return `<svg width="${chartSize}" height="${chartSize}" viewBox="0 0 ${chartSize} ${chartSize}" xmlns="http://www.w3.org/2000/svg"><text x="${chartSize / 2}" y="${chartSize / 2}" text-anchor="middle" fill="#666" font-size="14">No data</text></svg>`
  }

  // Increase viewBox width to accommodate legend, add height for title
  const topPadding = 35 // Space for title at the top
  const svgWidth = chartSize * 1.5 // 50% more width for legend
  const svgHeight = chartSize + topPadding // Add space for title
  const pieSize = chartSize * 0.55 // Pie chart takes 55% of original width
  const pieCenterX = pieSize / 2
  const pieCenterY = chartSize / 2 + topPadding // Shift pie chart down to make room for title
  const radius = pieSize / 2 - 10
  const colors = {
    code: '#4CAF50',
    css: '#2196F3',
  }

  const codePct = calculatePercentage(breakdown.code, totalSize)
  const cssPct = calculatePercentage(breakdown.css, totalSize)

  let currentAngle = -Math.PI / 2 // Start at top
  const segments: Array<{path: string; color: string; label: string; percentage: number}> = []

  // Code
  if (breakdown.code > 0) {
    const angle = (breakdown.code / total) * 2 * Math.PI
    const x1 = pieCenterX + radius * Math.cos(currentAngle)
    const y1 = pieCenterY + radius * Math.sin(currentAngle)
    const x2 = pieCenterX + radius * Math.cos(currentAngle + angle)
    const y2 = pieCenterY + radius * Math.sin(currentAngle + angle)
    const largeArc = angle > Math.PI ? 1 : 0
    const path = `M ${pieCenterX} ${pieCenterY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    segments.push({
      path,
      color: colors.code,
      label: 'Code',
      percentage: codePct,
    })
    currentAngle += angle
  }

  // CSS
  if (breakdown.css > 0) {
    const angle = (breakdown.css / total) * 2 * Math.PI
    const x1 = pieCenterX + radius * Math.cos(currentAngle)
    const y1 = pieCenterY + radius * Math.sin(currentAngle)
    const x2 = pieCenterX + radius * Math.cos(currentAngle + angle)
    const y2 = pieCenterY + radius * Math.sin(currentAngle + angle)
    const largeArc = angle > Math.PI ? 1 : 0
    const path = `M ${pieCenterX} ${pieCenterY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    segments.push({
      path,
      color: colors.css,
      label: 'CSS',
      percentage: cssPct,
    })
  }

  const paths = segments.map(s => `<path d="${s.path}" fill="${s.color}" stroke="#fff" stroke-width="2"/>`).join('')

  // Title above the chart - extract base app name and use library title
  const baseApp = app.replace(/-raw$|-gzip$/, '') as AppType
  const libTitle = getLibTitle(baseApp)
  const labelSuffix = app.endsWith('-raw') ? 'raw' : app.endsWith('-gzip') ? 'gzip' : ''
  const titleText = labelSuffix ? `${libTitle} - ${variant} (${labelSuffix})` : `${libTitle} - ${variant}`
  // Escape HTML for SVG text content
  const escapedTitle = titleText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  // Position title at the top with sufficient spacing
  const titleY = 18
  const titleX = svgWidth / 2

  // Legend positioned to the right of the pie chart, shifted down for title
  const legendX = pieSize + 30
  const legendY = topPadding + 20 // Shifted down to account for title space
  const legendItemHeight = 28
  const legendItems = segments
    .map((segment, index) => {
      const y = legendY + index * legendItemHeight
      return `<g>
      <rect x="${legendX}" y="${y - 10}" width="16" height="16" fill="${segment.color}" rx="3"/>
      <text x="${legendX + 24}" y="${y + 2}" font-size="13" fill="#333">${segment.label} (${segment.percentage.toFixed(1)}%)</text>
    </g>`
    })
    .join('')

  const svgContent = `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <text x="${titleX}" y="${titleY}" text-anchor="middle" font-size="14" font-weight="600" fill="#333">${escapedTitle}</text>
    ${paths}
    ${legendItems}
  </svg>`

  // Export SVG to file if statsDir is provided
  if (statsDir) {
    const chartsDir = join(statsDir, 'charts')
    const fileName = buildTool ? `pie-${app}-${variant}-${buildTool}.svg` : `pie-${app}-${variant}.svg`
    const filePath = join(chartsDir, fileName)
    saveSVGFile(svgContent, filePath)
    incrementExportedChartsCount()
  }

  return svgContent
}

/**
 * Formats the difference in KB.
 * @param diff difference in bytes
 * @param gzipDiff gzip difference in bytes (optional)
 * @returns formatted difference string (e.g., "+123 KB", "-45 KB", "0 KB" or "+123 KB / +50 KB")
 */
export function formatDiffKB(diff: number, gzipDiff?: number): string {
  const diffKB = diff / 1024
  if (gzipDiff !== undefined) {
    const gzipDiffKB = gzipDiff / 1024
    const diffFormatted = Math.abs(diffKB) < 0.01 ? '0 KB' : `${diffKB > 0 ? '+' : ''}${diffKB.toFixed(1)} KB`
    const gzipFormatted = Math.abs(gzipDiffKB) < 0.01 ? '0 KB' : `${gzipDiffKB > 0 ? '+' : ''}${gzipDiffKB.toFixed(1)} KB`
    return `${diffFormatted} / ${gzipFormatted}`
  }
  if (Math.abs(diffKB) < 0.01) {
    return '0 KB'
  }
  const sign = diffKB > 0 ? '+' : ''
  return `${sign}${diffKB.toFixed(1)} KB`
}

/**
 * Gets the app name for non-MUI version.
 * @param app original app name
 * @returns app name for non-MUI version
 */
export function getAppNameNonMui(app: AppType): string {
  return mapLibTitleNonMui[app]
}

/**
 * Gets the app name for MUI version.
 * @param app original app name
 * @returns app name for MUI version
 */
export function getAppNameMui(app: AppType): string {
  return mapLibTitleMui[app]
}


/**
 * Gets the variant name for table headers (removes -mui suffix).
 * @param variant original variant name
 * @returns variant name for headers
 */
export function getVariantHeaderName(variant: string): string {
  return variant.replace(/-mui$/, '')
}

/**
 * Generates a performance label for charts.
 * @param app app name
 * @param buildTool build tool name
 * @param hasMultipleTools whether multiple build tools are used
 * @returns performance label string
 */
export function generatePerformanceLabel(app: string, buildTool: string, hasMultipleTools: boolean): string {
  const libTitle = getLibTitle(app as AppType)
  return hasMultipleTools ? `${libTitle} (${buildTool})` : libTitle
}

/**
 * Calculates performance metrics for a set of results.
 * @param variantResults variant results to process
 * @param hasMultipleTools whether multiple build tools are used
 * @param speedBps network speed in bits per second
 * @returns array of performance data objects
 */
export function calculatePerformanceData(
  variantResults: BundleInfo[],
  hasMultipleTools: boolean,
  speedBps: number
): Array<{label: string; lcp: number; tti: number; parseTime: number}> {
  return variantResults.map(result => {
    const totalSizeGzip = result.totalSizeGzip || result.totalSize
    const metrics = calculatePerformanceMetrics(totalSizeGzip, result.breakdown.code, result.breakdown.css, speedBps)
    const label = generatePerformanceLabel(result.app, result.buildTool, hasMultipleTools)
    return {label, ...metrics}
  })
}

/**
 * Calculates minimum values for a column of variant results.
 * @param variant variant name
 * @param apps list of app names
 * @param allResults all bundle results
 * @param getVariantName function to get the variant name (for MUI/non-MUI)
 * @returns object with minimum value, gzip value, and row index
 */
export function calculateColumnMinimums(
  variant: string,
  apps: readonly string[],
  allResults: BundleInfo[],
  getVariantName: (variant: string) => string
): {value: number; gzipValue: number; rowIndex: number} {
  const variantResults: BundleInfo[] = []
  const variantName = getVariantName(variant)
  for (const app of apps) {
    const info = allResults.find(r => r.app === app && r.variant === variantName)
    if (info) {
      variantResults.push(info)
    }
  }
  if (variantResults.length === 0) {
    return {value: Infinity, gzipValue: Infinity, rowIndex: -1}
  }
  const sizes = variantResults.map(r => r.totalSize)
  const gzipSizes = variantResults.map(r => r.totalSizeGzip ?? r.totalSize)
  const minValue = Math.min(...sizes)
  const minGzipValue = Math.min(...gzipSizes)
  const rowIndex = apps.findIndex(app => {
    const info = allResults.find(r => r.app === app && r.variant === variantName)
    return info && info.totalSize === minValue
  })
  return {value: minValue, gzipValue: minGzipValue, rowIndex}
}

/**
 * Saves a Vega-Lite chart file and increments the chart count.
 * @param chartData Vega-Lite chart data
 * @param fileName file name for the chart
 * @param statsDir directory to save the chart
 */
export function saveVegaLiteChartFile(chartData: Record<string, unknown>, fileName: string, statsDir: string): void {
  const chartsDir = join(statsDir, 'charts')
  const filePath = join(chartsDir, fileName)
  saveVegaLiteFile(chartData, filePath)
  incrementExportedChartsCount()
}

/**
 * Processes chunks from bundle info and returns sorted array of chunk names and sizes.
 * @param chunks chunks object from bundle info
 * @returns array of chunk objects with name and size, sorted by size descending
 */
export function processChunks(chunks: BundleInfo['chunks']): Array<{name: string; size: number}> {
  return Object.entries(chunks)
    .map(([name, chunk]) => {
      const size = chunk.actualSize ?? chunk.size ?? chunk.parsedSize ?? chunk.statSize ?? 0
      return {name, size}
    })
    .sort((a, b) => b.size - a.size)
}

/**
 * Calculates unique and wasted sizes for a duplicate package.
 * @param totalSize total size of the duplicate package
 * @param occurrences number of occurrences
 * @returns object with uniqueSize and wastedSize
 */
export function calculateDuplicateSizes(totalSize: number, occurrences: number): {uniqueSize: number; wastedSize: number} {
  const uniqueSize = totalSize / occurrences
  const wastedSize = totalSize - uniqueSize
  return {uniqueSize, wastedSize}
}

/**
 * Calculates matrix cell comparison values for a bundle info.
 * @param info bundle info (or null/undefined)
 * @param colIndex column index
 * @param columnMins column minimums data
 * @param appIndex app index
 * @returns object with comparison values
 */
export function calculateMatrixCellComparison(
  info: BundleInfo | null | undefined,
  colIndex: number,
  columnMins: Array<{value: number; gzipValue: number; rowIndex: number}>,
  appIndex: number
): {
  isSmallest: boolean
  minValue: number
  minGzipValue: number
  diffToMin: number
  diffGzipToMin: number | undefined
} {
  if (!info) {
    return {
      isSmallest: false,
      minValue: 0,
      minGzipValue: 0,
      diffToMin: 0,
      diffGzipToMin: undefined,
    }
  }
  const isSmallest =
    colIndex < columnMins.length && columnMins[colIndex].rowIndex === appIndex && info.totalSize === columnMins[colIndex].value
  const minValue = colIndex < columnMins.length ? columnMins[colIndex].value : info.totalSize
  const minGzipValue = colIndex < columnMins.length ? columnMins[colIndex].gzipValue : (info.totalSizeGzip ?? info.totalSize)
  const diffToMin = info.totalSize - minValue
  const diffGzipToMin = info.totalSizeGzip !== undefined ? info.totalSizeGzip - minGzipValue : undefined
  return {isSmallest, minValue, minGzipValue, diffToMin, diffGzipToMin}
}

/**
 * Generates a variant label for display.
 * @param variant variant name
 * @param buildTool build tool name
 * @param hasMultipleTools whether multiple build tools are used
 * @param escapeFn optional function to escape the label (for HTML)
 * @returns variant label string
 */
export function generateVariantLabelCommon(
  variant: string,
  buildTool: string,
  hasMultipleTools: boolean,
  escapeFn?: (str: string) => string
): string {
  const escape = escapeFn ?? ((str: string) => str)
  return hasMultipleTools ? `${escape(variant)} (${escape(buildTool)})` : escape(variant)
}

/**
 * Checks if any duplicates exist across all bundle results.
 * @param allResults bundle info results
 * @returns true if any duplicates exist, false otherwise
 */
export function hasAnyDuplicates(allResults: BundleInfo[]): boolean {
  return allResults.some(result => result.duplicates.duplicateCount > 0)
}

/**
 * Displays duplicate packages information for a single result.
 * @param result bundle result
 * @param allResults all bundle results (to check if duplicates should be shown)
 */
export function displayDuplicatePackagesInfo(result: BundleInfo, allResults: BundleInfo[]): void {
  if (hasAnyDuplicates(allResults) && result.duplicates.duplicateCount > 0) {
    console.log(`\n    Duplicate Packages (${result.duplicates.duplicateCount} packages):`)
    console.log(`    ${'Package'.padEnd(40)} ${'Occurrences'.padEnd(15)} ${'Total Size'.padEnd(15)} ${'Wasted Size'.padEnd(15)}`)
    console.log(`    ${'-'.repeat(85)}`)

    for (const dup of result.duplicates.packages) {
      const {wastedSize} = calculateDuplicateSizes(dup.totalSize, dup.occurrences)
      console.log(
        `    ${dup.packageName.padEnd(40)} ${dup.occurrences.toString().padEnd(15)} ${formatSize(dup.totalSize).padEnd(15)} ${formatSize(wastedSize).padEnd(15)}`
      )
    }

    console.log(`    ${'Total Wasted Size'.padEnd(40)} ${formatSize(result.duplicates.totalDuplicateSize)}`)
  }
}

/**
 * Displays duplicate packages summary section.
 * @param allResults bundle info results
 * @param apps list of app names
 */
export function displayDuplicatePackagesSummary(allResults: BundleInfo[], apps: readonly AppType[]): void {
  if (hasAnyDuplicates(allResults)) {
    console.log('\n🔄 Duplicate Packages Summary:\n')
    for (const app of apps) {
      const appResults = allResults.filter(r => r.app === app)
      if (appResults.length === 0) continue

      console.log(`${getLibTitle(app)}:`)
      console.log('-'.repeat(120))
      const header = `${'Variant'.padEnd(20)} ${'Duplicates'.padEnd(15)} ${'Wasted Size'.padEnd(15)}`
      console.log(header)
      console.log('-'.repeat(120))

      for (const result of appResults.sort((a, b) => a.variant.localeCompare(b.variant))) {
        const duplicateInfo = result.duplicates.duplicateCount > 0 ? `${result.duplicates.duplicateCount} packages` : 'None'
        const wastedSize = result.duplicates.totalDuplicateSize > 0 ? formatSize(result.duplicates.totalDuplicateSize) : '0 B'
        console.log(`${result.variant.padEnd(20)} ${duplicateInfo.padEnd(15)} ${wastedSize.padEnd(15)}`)
      }
      console.log('-'.repeat(120))
      console.log('')
    }
  }
}

/**
 * Calculates minimum values for variant results (for highlighting smallest values).
 * @param variantResults variant results to analyze
 * @returns object with minimum values for total size, gzip size, code, CSS, and wasted size
 */
export function calculateVariantMinimums(
  variantResults: BundleInfo[]
): {
  minTotalSize: number
  minTotalGzipSize: number
  minCode: number
  minCSS: number
  minWasted: number
} {
  const totalSizes = variantResults.map(r => r.totalSize)
  const totalGzipSizes = variantResults.map(r => r.totalSizeGzip ?? r.totalSize)
  const codeSizes = variantResults.map(r => r.breakdown.code)
  const cssSizes = variantResults.map(r => r.breakdown.css)
  const wastedSizes = variantResults.map(r => r.duplicates.totalDuplicateSize)

  return {
    minTotalSize: totalSizes.length > 0 ? Math.min(...totalSizes) : 0,
    minTotalGzipSize: totalGzipSizes.length > 0 ? Math.min(...totalGzipSizes) : 0,
    minCode: codeSizes.length > 0 ? Math.min(...codeSizes) : 0,
    minCSS: cssSizes.length > 0 ? Math.min(...cssSizes) : 0,
    minWasted: wastedSizes.length > 0 ? Math.min(...wastedSizes) : 0,
  }
}

/**
 * Filters and sorts variant results from all results.
 * @param allResults all bundle results
 * @param variant variant name to filter by
 * @returns filtered and sorted variant results (sorted by total size descending)
 */
export function filterAndSortVariantResults(allResults: BundleInfo[], variant: string): BundleInfo[] {
  const variantResults = allResults.filter(r => r.variant === variant)
  variantResults.sort((a, b) => b.totalSize - a.totalSize)
  return variantResults
}

/**
 * Filters and sorts app results from all results.
 * @param allResults all bundle results
 * @param app app name to filter by
 * @returns filtered and sorted app results (sorted by variant name)
 */
export function filterAndSortAppResults(allResults: BundleInfo[], app: string): BundleInfo[] {
  const appResults = allResults.filter(r => r.app === app)
  appResults.sort((a, b) => a.variant.localeCompare(b.variant))
  return appResults
}

/**
 * Filters out MUI variants from the variants list.
 * @param variants list of variant names
 * @returns list of non-MUI variant names
 */
export function filterNonMuiVariants(variants: readonly string[]): string[] {
  return variants.filter(v => !v.endsWith('-mui'))
}

/**
 * Generates and saves performance charts for variant results.
 * @param variantResults variant results to process
 * @param variant variant name for file naming
 * @param hasMultipleTools whether multiple build tools are used
 * @param statsDir directory to save chart files (optional)
 * @param slow3GSpeed slow 3G speed in bytes per second
 * @param avg4GSpeed average 4G speed in bytes per second
 * @returns object with slow3GData, avg4GData, and vegaLiteChart
 */
export function generateAndSavePerformanceCharts(
  variantResults: BundleInfo[],
  variant: string,
  hasMultipleTools: boolean,
  statsDir: string | undefined,
  slow3GSpeed: number,
  avg4GSpeed: number
): {
  slow3GData: Array<{label: string; lcp: number; tti: number; parseTime: number}>
  avg4GData: Array<{label: string; lcp: number; tti: number; parseTime: number}>
  vegaLiteChart: Record<string, unknown> | null
} {
  const slow3GData = calculatePerformanceData(variantResults, hasMultipleTools, slow3GSpeed)
  const avg4GData = calculatePerformanceData(variantResults, hasMultipleTools, avg4GSpeed)
  const vegaLiteChart = generateVegaLiteChart(slow3GData, avg4GData, variant)

  if (vegaLiteChart && statsDir) {
    const fileName = `performance-${variant}.json`
    saveVegaLiteChartFile(vegaLiteChart, fileName, statsDir)
  }

  return {slow3GData, avg4GData, vegaLiteChart}
}
