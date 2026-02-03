/* eslint-disable no-console */

import {writeFileSync} from 'fs'
import {join} from 'path'
import {AVERAGE_4G_SPEED_BPS, SLOW_3G_SPEED_BPS} from './performance-constants.ts'
import {
  type AppType,
  calculateColumnMinimums,
  calculateDuplicateSizes,
  calculateVariantMinimums,
  filterAndSortAppResults,
  filterAndSortVariantResults,
  filterNonMuiVariants,
  formatDiffKB,
  generateAndSavePerformanceCharts,
  generatePieChart,
  generateVegaLitePieChart,
  getAppNameMui,
  getAppNameNonMui,
  getExportedChartsCount,
  getLibTitle,
  getVariantHeaderName,
  hasAnyDuplicates,
  incrementExportedChartsCount,
  processChunks,
  resetExportedChartsCount,
  saveSVGFile,
  saveVegaLiteChartFile,
} from './report-common.ts'
import {
  generateAppLink,
  generateDetailId,
  generateMatrixCellForVariant,
  generatePieChartId,
  generateVariantLabel,
} from './report-html-helpers.ts'
import {
  escapeHtml,
  generateAppDetailSection,
  generateAppSection,
  generateBreakdownTable,
  generateChunkRow,
  generateChunkTotalRow,
  generateDetailedVariantSection,
  generateDuplicateRow,
  generateDuplicatesTable,
  generateHiddenVegaLiteCode,
  generateHTMLDocument,
  generateMatrixRow,
  generateNoChunksRow,
  generatePerformanceChartSVG,
  generateSummaryByAppHeaderMultipleTools,
  generateSummaryByAppHeaderSingleTool,
  generateSummaryByAppRowMultipleTools,
  generateSummaryByAppRowSingleTool,
  generateSummaryByVariantHeaderMultipleTools,
  generateSummaryByVariantHeaderSingleTool,
  generateSummaryByVariantRowMultipleTools,
  generateSummaryByVariantRowSingleTool,
  generateVariantSection,
} from './report-html-templates.ts'
import type {BundleInfo} from './tool.ts'
import {calculatePercentage} from './tool.ts'
import {formatSize, formatSizeWithCompressionHTML} from './utils.ts'

/**
 * Exports bundle size results to HTML format.
 * @param allResults bundle info results
 * @param apps list of app names
 * @param variants list of variant names
 * @param activeBuildTools list of active build tools
 * @param statsDir directory to save HTML file
 */
export function exportToHTML(
  allResults: BundleInfo[],
  apps: readonly AppType[],
  variants: readonly string[],
  activeBuildTools: readonly string[],
  statsDir: string
): void {
  if (allResults.length === 0) {
    return
  }

  /**
   * Generates a performance comparison chart SVG showing all variants with both 3G and 4G data.
   * @param slow3GData array of {label, lcp, tti, parseTime} objects for Slow 3G
   * @param avg4GData array of {label, lcp, tti, parseTime} objects for Average 4G
   * @param variant variant name for file naming
   * @param statsDir directory to save chart files (optional)
   * @returns SVG string
   */
  const generatePerformanceChart = (
    slow3GData: Array<{label: string; lcp: number; tti: number; parseTime: number}>,
    avg4GData: Array<{label: string; lcp: number; tti: number; parseTime: number}>,
    variant: string,
    statsDir?: string
  ): string => {
    if (slow3GData.length === 0 && avg4GData.length === 0) return ''

    const width = 1000
    const height = 500
    const padding = {top: 40, right: 150, bottom: 120, left: 80}
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Find max value for scaling (across both datasets)
    const allData = [...slow3GData, ...avg4GData]
    const maxValue = Math.max(...allData.map(d => Math.max(d.lcp, d.tti, d.parseTime)))

    // Scale to fit chart (add 20% padding)
    const scale = (chartHeight * 0.8) / maxValue
    const dataLength = Math.max(slow3GData.length, avg4GData.length)
    const groupWidth = chartWidth / dataLength
    const barWidth = groupWidth * 0.08 // 5 bars per group (2 for 3G, 2 for 4G, 1 combined Parse) - smaller to prevent overlap

    const bars: string[] = []
    const labels: string[] = []

    // Draw bars for each variant
    for (let index = 0; index < dataLength; index++) {
      const groupX = padding.left + index * groupWidth + groupWidth / 2
      const yBase = padding.top + chartHeight

      const slow3GItem = slow3GData[index]
      const avg4GItem = avg4GData[index]

      // Slow 3G bars (darker, left side)
      if (slow3GItem) {
        const lcp3GHeight = slow3GItem.lcp * scale
        const lcp3GX = groupX - barWidth * 3.5
        bars.push(
          `<rect x="${lcp3GX}" y="${yBase - lcp3GHeight}" width="${barWidth}" height="${lcp3GHeight}" fill="#2E7D32" opacity="0.8"><title>3G LCP: ${slow3GItem.lcp.toFixed(0)}ms</title></rect>`
        )

        const tti3GHeight = slow3GItem.tti * scale
        const tti3GX = groupX - barWidth * 2.0
        bars.push(
          `<rect x="${tti3GX}" y="${yBase - tti3GHeight}" width="${barWidth}" height="${tti3GHeight}" fill="#1565C0" opacity="0.8"><title>3G TTI: ${slow3GItem.tti.toFixed(0)}ms</title></rect>`
        )
      }

      // Combined Parse bar (average of 3G and 4G parse times, centered)
      const parse3G = slow3GItem?.parseTime || 0
      const parse4G = avg4GItem?.parseTime || 0
      const avgParse = parse3G > 0 && parse4G > 0 ? (parse3G + parse4G) / 2 : parse3G || parse4G
      if (avgParse > 0) {
        const parseHeight = avgParse * scale
        const parseX = groupX - barWidth * 0.5
        bars.push(
          `<rect x="${parseX}" y="${yBase - parseHeight}" width="${barWidth}" height="${parseHeight}" fill="#FF9800" opacity="0.8"><title>Parse: ${avgParse.toFixed(0)}ms (3G: ${parse3G.toFixed(0)}ms, 4G: ${parse4G.toFixed(0)}ms)</title></rect>`
        )
      }

      // Average 4G bars (lighter, right side)
      if (avg4GItem) {
        const lcp4GHeight = avg4GItem.lcp * scale
        const lcp4GX = groupX + barWidth * 1.0
        bars.push(
          `<rect x="${lcp4GX}" y="${yBase - lcp4GHeight}" width="${barWidth}" height="${lcp4GHeight}" fill="#4CAF50" opacity="0.8"><title>4G LCP: ${avg4GItem.lcp.toFixed(0)}ms</title></rect>`
        )

        const tti4GHeight = avg4GItem.tti * scale
        const tti4GX = groupX + barWidth * 2.5
        bars.push(
          `<rect x="${tti4GX}" y="${yBase - tti4GHeight}" width="${barWidth}" height="${tti4GHeight}" fill="#2196F3" opacity="0.8"><title>4G TTI: ${avg4GItem.tti.toFixed(0)}ms</title></rect>`
        )
      }

      // Label (use label from either dataset)
      const label = slow3GItem?.label || avg4GItem?.label || ''
      if (label) {
        const labelParts = label.split(' ')
        labelParts.forEach((part, partIndex) => {
          labels.push(
            `<text x="${groupX}" y="${yBase + 35 + partIndex * 12}" text-anchor="middle" font-size="10" fill="#333" transform="rotate(-45 ${groupX} ${yBase + 35 + partIndex * 12})">${escapeHtml(part)}</text>`
          )
        })
      }
    }

    // Y-axis labels
    const yAxisLabels: string[] = []
    const ySteps = 5
    for (let i = 0; i <= ySteps; i++) {
      const value = (maxValue / ySteps) * i
      const y = padding.top + chartHeight - value * scale
      yAxisLabels.push(
        `<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" font-size="11" fill="#666">${value.toFixed(0)}ms</text>`
      )
    }

    // Grid lines
    const gridLines: string[] = []
    for (let i = 0; i <= ySteps; i++) {
      const y = padding.top + chartHeight - (maxValue / ySteps) * i * scale
      gridLines.push(`<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e0e0e0" stroke-width="1"/>`)
    }

    const svgContent = generatePerformanceChartSVG(width, height, gridLines, bars, yAxisLabels, labels, padding)

    // Export SVG to file if statsDir is provided
    if (statsDir) {
      const chartsDir = join(statsDir, 'charts')
      const fileName = `performance-${variant}.svg`
      const filePath = join(chartsDir, fileName)
      saveSVGFile(svgContent, filePath)
      incrementExportedChartsCount()
    }

    return svgContent
  }

  const hasMultipleTools = activeBuildTools.length > 1
  const hasDuplicates = hasAnyDuplicates(allResults)

  const summaryByAppSections: string[] = []

  for (const app of apps) {
    const appResults = filterAndSortAppResults(allResults, app)
    if (appResults.length === 0) continue

    const rows = appResults
      .map(result => {
        const chunkCount = Object.keys(result.chunks).length
        const detailId = generateDetailId(result.app, result.variant, result.buildTool, hasMultipleTools)
        const variantLink = `<a href="#${detailId}">${escapeHtml(result.variant)}</a>`
        if (hasMultipleTools) {
          return generateSummaryByAppRowMultipleTools(
            variantLink,
            escapeHtml(result.buildTool),
            formatSizeWithCompressionHTML(result.totalSize, result.totalSizeGzip),
            chunkCount,
            formatSizeWithCompressionHTML(result.breakdown.code, result.breakdownGzip?.code),
            formatSizeWithCompressionHTML(result.breakdown.css, result.breakdownGzip?.css),
            result.duplicates.duplicateCount,
            escapeHtml(formatSize(result.duplicates.totalDuplicateSize)),
            hasDuplicates
          )
        } else {
          return generateSummaryByAppRowSingleTool(
            variantLink,
            formatSizeWithCompressionHTML(result.totalSize, result.totalSizeGzip),
            chunkCount,
            formatSizeWithCompressionHTML(result.breakdown.code, result.breakdownGzip?.code),
            formatSizeWithCompressionHTML(result.breakdown.css, result.breakdownGzip?.css),
            result.duplicates.duplicateCount,
            escapeHtml(formatSize(result.duplicates.totalDuplicateSize)),
            hasDuplicates
          )
        }
      })
      .join('')

    const headerRow = hasMultipleTools
      ? generateSummaryByAppHeaderMultipleTools(hasDuplicates)
      : generateSummaryByAppHeaderSingleTool(hasDuplicates)
    const appSectionId = `app-${app}`
    summaryByAppSections.push(generateAppSection(appSectionId, getLibTitle(app), headerRow, rows))
  }

  const summaryByVariantSections: string[] = []

  for (const variant of variants) {
    const variantResults = filterAndSortVariantResults(allResults, variant)
    if (variantResults.length === 0) continue

    // Find minimum values for highlighting
    const {minTotalSize, minTotalGzipSize, minCode, minCSS, minWasted} = calculateVariantMinimums(variantResults)

    const rows = variantResults
      .map(result => {
        const chunkCount = Object.keys(result.chunks).length
        const totalSizeClass = result.totalSize === minTotalSize ? ' class="smallest"' : ''
        const codeClass = result.breakdown.code === minCode ? ' class="smallest"' : ''
        const cssClass = result.breakdown.css === minCSS ? ' class="smallest"' : ''
        const wastedClass = result.duplicates.totalDuplicateSize === minWasted && minWasted > 0 ? ' class="smallest"' : ''
        const diffToMin = result.totalSize - minTotalSize
        const diffGzipToMin = result.totalSizeGzip !== undefined ? result.totalSizeGzip - minTotalGzipSize : undefined
        const diffHint =
          diffToMin === 0 && (!diffGzipToMin || diffGzipToMin === 0)
            ? ''
            : `<br/><span class="diff-hint" title="Difference to smallest variant: ${formatDiffKB(diffToMin, diffGzipToMin)}">(${formatDiffKB(diffToMin, diffGzipToMin)})</span><br/>`
        const totalSizeCell = `${totalSizeClass}>${formatSizeWithCompressionHTML(result.totalSize, result.totalSizeGzip)}${diffHint}`
        const codeSizeCell = `${codeClass}>${formatSizeWithCompressionHTML(result.breakdown.code, result.breakdownGzip?.code)}`
        const cssSizeCell = `${cssClass}>${formatSizeWithCompressionHTML(result.breakdown.css, result.breakdownGzip?.css)}`
        const wastedSizeCell = `${wastedClass}>${escapeHtml(formatSize(result.duplicates.totalDuplicateSize))}`
        const appLabel = result.variant.endsWith('-mui')
          ? getAppNameMui(result.app as AppType)
          : getAppNameNonMui(result.app as AppType)
        if (hasMultipleTools) {
          return generateSummaryByVariantRowMultipleTools(
            appLabel,
            escapeHtml(result.buildTool),
            totalSizeCell,
            chunkCount,
            codeSizeCell,
            cssSizeCell,
            result.duplicates.duplicateCount,
            wastedSizeCell,
            hasDuplicates
          )
        } else {
          return generateSummaryByVariantRowSingleTool(
            appLabel,
            totalSizeCell,
            chunkCount,
            codeSizeCell,
            cssSizeCell,
            result.duplicates.duplicateCount,
            wastedSizeCell,
            hasDuplicates
          )
        }
      })
      .join('')

    const variantHeaderRow = hasMultipleTools
      ? generateSummaryByVariantHeaderMultipleTools(hasDuplicates)
      : generateSummaryByVariantHeaderSingleTool(hasDuplicates)

    // Generate performance charts for all variants together
    const {slow3GData, avg4GData, vegaLiteChart} = generateAndSavePerformanceCharts(
      variantResults,
      variant,
      hasMultipleTools,
      statsDir,
      SLOW_3G_SPEED_BPS,
      AVERAGE_4G_SPEED_BPS
    )

    const combinedChart = generatePerformanceChart(slow3GData, avg4GData, variant, statsDir)

    // Hidden Vega-Lite chart code for copy functionality
    const hiddenVegaLiteCode = vegaLiteChart
      ? generateHiddenVegaLiteCode(`performance-${variant}`, JSON.stringify(vegaLiteChart, null, 2))
      : ''

    summaryByVariantSections.push(generateVariantSection(variant, variantHeaderRow, rows, combinedChart, hiddenVegaLiteCode))
  }

  // Use non-MUI variant names for headers (login, booking)
  const nonMuiVariants = filterNonMuiVariants(variants)
  const matrixHeaderCells = nonMuiVariants.map(v => `<th>${escapeHtml(getVariantHeaderName(v))}<sub>(raw/gzip)</sub></th>`).join('')

  // Calculate minimum values for non-MUI table
  const columnMinsNonMui = nonMuiVariants.map((variant: string) => calculateColumnMinimums(variant, apps, allResults, (v: string) => v))

  // Generate non-MUI table rows
  const matrixRowsNonMui = apps
    .map((app: AppType, appIndex: number) => {
      const cellsNonMui = nonMuiVariants
        .map((variant: string, colIndex: number) => {
          const info = allResults.find(r => r.app === app && r.variant === variant) ?? null
          return generateMatrixCellForVariant(info, colIndex, columnMinsNonMui, appIndex)
        })
        .join('')
      const appLinkNonMui = generateAppLink(app, getAppNameNonMui)
      return generateMatrixRow(appLinkNonMui, cellsNonMui)
    })
    .join('')

  // Calculate minimum values for MUI table
  const columnMinsMui = nonMuiVariants.map((variant: string) =>
    calculateColumnMinimums(variant, apps, allResults, (v: string) => `${v}-mui`)
  )

  // Generate MUI table rows
  const matrixRowsMui = apps
    .map((app: AppType, appIndex: number) => {
      const cellsMui = nonMuiVariants
        .map((variant: string, colIndex: number) => {
          const muiVariant = `${variant}-mui`
          const info = allResults.find(r => r.app === app && r.variant === muiVariant) ?? null
          return generateMatrixCellForVariant(info, colIndex, columnMinsMui, appIndex)
        })
        .join('')
      const appLinkMui = generateAppLink(app, getAppNameMui)
      return generateMatrixRow(appLinkMui, cellsMui)
    })
    .join('')

  const detailedSections: string[] = []

  for (const app of apps) {
    const appResults = filterAndSortAppResults(allResults, app)
    if (appResults.length === 0) continue

    const variantsHtml = appResults
      .map(result => {
        const chunks = processChunks(result.chunks)

        const chunkRows =
          chunks.length === 0 ? generateNoChunksRow() : chunks.map(chunk => generateChunkRow(chunk.name, formatSize(chunk.size))).join('')

        const totalRow = generateChunkTotalRow(formatSizeWithCompressionHTML(result.totalSize, result.totalSizeGzip))

        // Breakdown table
        const codePct = calculatePercentage(result.breakdown.code, result.totalSize)
        const cssPct = calculatePercentage(result.breakdown.css, result.totalSize)
        const breakdownTable = generateBreakdownTable(
          formatSizeWithCompressionHTML(result.breakdown.code, result.breakdownGzip?.code),
          codePct,
          formatSizeWithCompressionHTML(result.breakdown.css, result.breakdownGzip?.css),
          cssPct
        )

        // Pure SVG pie charts with integrated legend (raw and gzip)
        const rawPieChart = generatePieChart(
          result.breakdown,
          result.totalSize,
          `${result.app}-raw`,
          result.variant,
          result.buildTool,
          statsDir
        )
        const gzipPieChart =
          result.breakdownGzip && result.totalSizeGzip
            ? generatePieChart(result.breakdownGzip, result.totalSizeGzip, `${result.app}-gzip`, result.variant, result.buildTool, statsDir)
            : ''

        // Generate Vega-Lite pie chart
        const vegaLitePieChart = generateVegaLitePieChart(
          result.breakdown,
          result.totalSize,
          getLibTitle(result.app as AppType),
          result.variant
        )
        const pieChartId = generatePieChartId(result.app, result.variant, result.buildTool, hasMultipleTools)
        if (vegaLitePieChart && statsDir) {
          const fileName = hasMultipleTools
            ? `pie-${result.app}-${result.variant}-${result.buildTool}.json`
            : `pie-${result.app}-${result.variant}.json`
          saveVegaLiteChartFile(vegaLitePieChart, fileName, statsDir)
        }

        // Hidden Vega-Lite pie chart code for copy functionality
        const hiddenVegaLitePieCode = vegaLitePieChart
          ? generateHiddenVegaLiteCode(pieChartId, JSON.stringify(vegaLitePieChart, null, 2))
          : ''

        // Duplicate packages table
        let duplicatesTable = ''
        if (hasDuplicates && result.duplicates.duplicateCount > 0) {
          const duplicateRows = result.duplicates.packages
            .map(dup => {
              const {wastedSize} = calculateDuplicateSizes(dup.totalSize, dup.occurrences)
              const chunksList = dup.chunks.join(', ')
              return generateDuplicateRow(dup.packageName, dup.occurrences, formatSize(dup.totalSize), formatSize(wastedSize), chunksList)
            })
            .join('')
          duplicatesTable = generateDuplicatesTable(
            result.duplicates.duplicateCount,
            duplicateRows,
            escapeHtml(formatSize(result.duplicates.totalDuplicateSize))
          )
        }

        const variantLabel = generateVariantLabel(result.variant, result.buildTool, hasMultipleTools)
        const detailId = generateDetailId(result.app, result.variant, result.buildTool, hasMultipleTools)

        return generateDetailedVariantSection(
          detailId,
          variantLabel,
          pieChartId,
          rawPieChart,
          gzipPieChart,
          breakdownTable,
          chunkRows,
          totalRow,
          duplicatesTable,
          hiddenVegaLitePieCode
        )
      })
      .join('')

    detailedSections.push(generateAppDetailSection(getLibTitle(app), variantsHtml))
  }

  const nonMuiLibTitles = apps.map(app => getAppNameNonMui(app)).join(', ')
  const muiLibTitles = apps.map(app => getAppNameMui(app)).join(', ')

  const html = generateHTMLDocument(
    activeBuildTools,
    matrixHeaderCells,
    matrixRowsNonMui,
    matrixRowsMui,
    summaryByAppSections,
    summaryByVariantSections,
    detailedSections,
    nonMuiLibTitles,
    muiLibTitles
  )

  const htmlPath = join(statsDir, 'index.html')
  writeFileSync(htmlPath, html, 'utf-8')
  console.log(`📄 HTML report exported to: ${htmlPath}`)
  if (getExportedChartsCount() > 0) {
    const chartsDir = join(statsDir, 'charts')
    console.log(`📊 ${getExportedChartsCount()} SVG chart(s) exported to: ${chartsDir}`)
    resetExportedChartsCount() // Reset for next export
  }
}
