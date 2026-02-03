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
  generateVegaLitePieChart,
  getAppNameMui,
  getAppNameNonMui,
  getLibTitle,
  getVariantHeaderName,
  hasAnyDuplicates,
  processChunks,
  saveVegaLiteChartFile,
} from './report-common.ts'
import {
  escapeMarkdown,
  formatSmallestValue,
  generateAppTableHeader,
  generateAppTableRowMultipleTools,
  generateAppTableRowSingleTool,
  generateAppTableSeparator,
  generateMatrixCellValue,
  generatePieChartFileName,
  generateVariantLabel,
  generateVariantTableHeader,
  generateVariantTableRowMultipleTools,
  generateVariantTableRowSingleTool,
  generateVariantTableSeparator,
  toValidIdentifier,
} from './report-mdx-helpers.ts'
import type {BundleInfo} from './tool.ts'
import {calculatePercentage} from './tool.ts'
import {formatSize, formatSizeWithCompression} from './utils.ts'

/**
 * Exports bundle size results to Markdown format.
 * @param allResults bundle info results
 * @param apps list of app names
 * @param variants list of variant names
 * @param activeBuildTools list of active build tools
 * @param statsDir directory to save Markdown file
 */
export function exportToMarkdown(
  allResults: BundleInfo[],
  apps: readonly AppType[],
  variants: readonly string[],
  activeBuildTools: readonly string[],
  statsDir: string
): void {
  if (allResults.length === 0) {
    return
  }

  const hasMultipleTools = activeBuildTools.length > 1
  const hasDuplicates = hasAnyDuplicates(allResults)

  const markdownSections: string[] = []

  // Title and metadata
  // markdownSections.push('# Bundle Size Report\n')
  // markdownSections.push(`Generated at: ${new Date().toISOString()}\n`)
  // if (activeBuildTools.length > 1) {
  //   markdownSections.push(`Build Tools: ${activeBuildTools.map(t => t.toUpperCase()).join(', ')}\n`)
  // }

  // Summary Matrix - split into two tables
  const nonMuiVariants = filterNonMuiVariants(variants)

  // Main header
  markdownSections.push('### Summary Matrix (Total Size)\n')

  // Non-MUI table
  const nonMuiLibTitles = apps.map(app => escapeMarkdown(getAppNameNonMui(app))).join(', ')
  markdownSections.push(`#### Non-MUI (${nonMuiLibTitles})\n`)
  const matrixHeaderNonMui = ['App', ...nonMuiVariants.map(v => `${escapeMarkdown(getVariantHeaderName(v))}<sub>(raw/gzip)</sub>`)].join(
    ' | '
  )
  markdownSections.push(`| ${matrixHeaderNonMui} |`)
  markdownSections.push(`| ${nonMuiVariants.map(() => '---').join(' | ')} | --- |`)

  // Calculate minimum values for non-MUI table
  const columnMinsNonMui = nonMuiVariants.map((variant: string) => calculateColumnMinimums(variant, apps, allResults, (v: string) => v))

  for (let appIndex = 0; appIndex < apps.length; appIndex++) {
    const app = apps[appIndex]
    const appNameNonMui = getAppNameNonMui(app)
    const rowNonMui: string[] = [escapeMarkdown(appNameNonMui)]
    for (let colIndex = 0; colIndex < nonMuiVariants.length; colIndex++) {
      const variant = nonMuiVariants[colIndex]
      const info = allResults.find(r => r.app === app && r.variant === variant) ?? null
      rowNonMui.push(generateMatrixCellValue(info, colIndex, columnMinsNonMui, appIndex))
    }
    markdownSections.push(`| ${rowNonMui.join(' | ')} |`)
  }
  markdownSections.push('> **Legend:** Bold values indicate the smallest value in each comparison. Smaller is better.\n')

  // MUI table
  const muiLibTitles = apps.map(app => escapeMarkdown(getAppNameMui(app))).join(', ')
  markdownSections.push(`#### MUI (${muiLibTitles})\n`)
  const matrixHeaderMui = [
    'App',
    ...nonMuiVariants.map((v: string) => `${escapeMarkdown(getVariantHeaderName(v))}<sub>(raw/gzip)</sub>`),
  ].join(' | ')
  markdownSections.push(`| ${matrixHeaderMui} |`)
  markdownSections.push(`| ${nonMuiVariants.map(() => '---').join(' | ')} | --- |`)

  // Calculate minimum values for MUI table
  const columnMinsMui = nonMuiVariants.map((variant: string) =>
    calculateColumnMinimums(variant, apps, allResults, (v: string) => `${v}-mui`)
  )

  for (let appIndex = 0; appIndex < apps.length; appIndex++) {
    const app = apps[appIndex]
    const appNameMui = getAppNameMui(app)
    const rowMui: string[] = [escapeMarkdown(appNameMui)]
    for (let colIndex = 0; colIndex < nonMuiVariants.length; colIndex++) {
      const variant = nonMuiVariants[colIndex]
      const muiVariant = `${variant}-mui`
      const info = allResults.find(r => r.app === app && r.variant === muiVariant) ?? null
      rowMui.push(generateMatrixCellValue(info, colIndex, columnMinsMui, appIndex))
    }
    markdownSections.push(`| ${rowMui.join(' | ')} |`)
  }
  markdownSections.push('> **Legend:** Bold values indicate the smallest value in each comparison. Smaller is better.\n')

  // Comparison by App
  markdownSections.push('### Comparison by App\n')

  for (const app of apps) {
    const appResults = filterAndSortAppResults(allResults, app)
    if (appResults.length === 0) continue

    markdownSections.push(`#### ${getLibTitle(app)}\n`)
    markdownSections.push(generateAppTableHeader(hasMultipleTools, hasDuplicates))
    markdownSections.push(generateAppTableSeparator(hasMultipleTools, hasDuplicates))

    for (const result of appResults) {
      const chunkCount = Object.keys(result.chunks).length
      if (hasMultipleTools) {
        markdownSections.push(generateAppTableRowMultipleTools(result, chunkCount, hasDuplicates))
      } else {
        markdownSections.push(generateAppTableRowSingleTool(result, chunkCount, hasDuplicates))
      }
    }

    markdownSections.push('')
  }

  // Comparison by Variant
  markdownSections.push('### Comparison by Variant\n')

  for (const variant of variants) {
    const variantResults = filterAndSortVariantResults(allResults, variant)
    if (variantResults.length === 0) continue

    // Find minimum values for highlighting
    const {minTotalSize, minTotalGzipSize, minCode, minCSS, minWasted} = calculateVariantMinimums(variantResults)

    markdownSections.push(`#### ${variant.toUpperCase()}\n`)
    markdownSections.push(generateVariantTableHeader(hasMultipleTools, hasDuplicates))
    markdownSections.push(generateVariantTableSeparator(hasMultipleTools, hasDuplicates))

    for (const result of variantResults) {
      const chunkCount = Object.keys(result.chunks).length
      const diffToMin = result.totalSize - minTotalSize
      const diffGzipToMin = result.totalSizeGzip !== undefined ? result.totalSizeGzip - minTotalGzipSize : undefined
      const diffHint = diffToMin === 0 && (!diffGzipToMin || diffGzipToMin === 0) ? '' : ` (${formatDiffKB(diffToMin, diffGzipToMin)})`
      const totalSizeValue = escapeMarkdown(formatSizeWithCompression(result.totalSize, result.totalSizeGzip)) + diffHint
      const totalSizeFormatted = formatSmallestValue(totalSizeValue, result.totalSize === minTotalSize)
      const codeValue = escapeMarkdown(formatSizeWithCompression(result.breakdown.code, result.breakdownGzip?.code))
      const codeFormatted = formatSmallestValue(codeValue, result.breakdown.code === minCode)
      const cssValue = escapeMarkdown(formatSizeWithCompression(result.breakdown.css, result.breakdownGzip?.css))
      const cssFormatted = formatSmallestValue(cssValue, result.breakdown.css === minCSS)
      const wastedValue = escapeMarkdown(formatSize(result.duplicates.totalDuplicateSize))
      const wastedFormatted = formatSmallestValue(wastedValue, result.duplicates.totalDuplicateSize === minWasted && minWasted > 0)
      const appLabel = result.variant.endsWith('-mui')
        ? getAppNameMui(result.app as AppType)
        : getAppNameNonMui(result.app as AppType)
      if (hasMultipleTools) {
        markdownSections.push(
          generateVariantTableRowMultipleTools(
            appLabel,
            result,
            chunkCount,
            totalSizeFormatted,
            codeFormatted,
            cssFormatted,
            wastedFormatted,
            hasDuplicates
          )
        )
      } else {
        markdownSections.push(
          generateVariantTableRowSingleTool(
            appLabel,
            result,
            chunkCount,
            totalSizeFormatted,
            codeFormatted,
            cssFormatted,
            wastedFormatted,
            hasDuplicates
          )
        )
      }
    }

    markdownSections.push('> **Legend:** Bold values indicate the smallest value in each comparison. Smaller is better.\n')

    // Add performance chart for this variant
    const {vegaLiteChart} = generateAndSavePerformanceCharts(
      variantResults,
      variant,
      hasMultipleTools,
      statsDir,
      SLOW_3G_SPEED_BPS,
      AVERAGE_4G_SPEED_BPS
    )
    if (vegaLiteChart !== null && statsDir) {

      // Add Vega-Lite chart to markdown
      const chartImportName = `performance${toValidIdentifier(variant)}`
      markdownSections.push(`\n##### Performance Comparison (using gzip sizes)\n\n`)
      markdownSections.push(`import ${chartImportName} from '@site/static/includes/bundle-size/performance-${variant}.json';\n\n`)
      markdownSections.push(`<VegaLite spec={${chartImportName}}/>\n\n`)
    }
  }

  // Detailed Chunk Information
  markdownSections.push('### Detailed Chunk Information\n')

  for (const app of apps) {
    const appResults = filterAndSortAppResults(allResults, app)
    if (appResults.length === 0) continue

    markdownSections.push(`#### ${getLibTitle(app)}\n`)

    for (const result of appResults) {
      const variantLabel = generateVariantLabel(result.variant, result.buildTool, hasMultipleTools)
      markdownSections.push(`##### Variant: ${variantLabel}\n`)

      // Breakdown section
      const codePct = calculatePercentage(result.breakdown.code, result.totalSize)
      const cssPct = calculatePercentage(result.breakdown.css, result.totalSize)
      markdownSections.push('**Bundle Breakdown:**\n')

      // Generate Vega-Lite pie chart (raw)
      const vegaLitePieChart = generateVegaLitePieChart(
        result.breakdown,
        result.totalSize,
        getLibTitle(result.app as AppType),
        result.variant,
        'raw'
      )

      // Generate Vega-Lite pie chart (gzip) if available
      const vegaLitePieChartGzip =
        result.breakdownGzip && result.totalSizeGzip
          ? generateVegaLitePieChart(
              result.breakdownGzip,
              result.totalSizeGzip,
              getLibTitle(result.app as AppType),
              result.variant,
              'gzip'
            )
          : null

      // Collect pie chart imports and components
      const pieChartImports: string[] = []
      const pieChartComponents: string[] = []

      if (vegaLitePieChart !== null && statsDir) {
        const fileName = generatePieChartFileName(result.app, result.variant, result.buildTool, hasMultipleTools)
        saveVegaLiteChartFile(vegaLitePieChart, fileName, statsDir)

        const pieChartImportName = `pie${toValidIdentifier(result.app)}${toValidIdentifier(result.variant)}${hasMultipleTools ? toValidIdentifier(result.buildTool) : ''}`
        pieChartImports.push(`import ${pieChartImportName} from '@site/static/includes/bundle-size/${fileName}';`)
        pieChartComponents.push(`<VegaLite spec={${pieChartImportName}}/>`)
      }

      if (vegaLitePieChartGzip !== null && statsDir) {
        const fileName = generatePieChartFileName(result.app, result.variant, result.buildTool, hasMultipleTools, 'gzip')
        saveVegaLiteChartFile(vegaLitePieChartGzip, fileName, statsDir)

        const pieChartGzipImportName = `pie${toValidIdentifier(result.app)}${toValidIdentifier(result.variant)}${hasMultipleTools ? toValidIdentifier(result.buildTool) : ''}Gzip`
        pieChartImports.push(`import ${pieChartGzipImportName} from '@site/static/includes/bundle-size/${fileName}';`)
        pieChartComponents.push(`<VegaLite spec={${pieChartGzipImportName}}/>`)
      }

      // Add pie charts section with flexbox layout
      if (pieChartImports.length > 0) {
        markdownSections.push(pieChartImports.join('\n'))
        markdownSections.push('\n\n')
        if (pieChartComponents.length > 1) {
          // Multiple charts: display side by side
          markdownSections.push(`<div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>\n`)
          pieChartComponents.forEach(component => {
            markdownSections.push(`  <div style={{flex: '1', minWidth: '300px'}}>${component}</div>\n`)
          })
          markdownSections.push(`</div>\n\n`)
        } else {
          // Single chart: display normally
          markdownSections.push(`${pieChartComponents[0]}\n\n`)
        }
      }

      markdownSections.push('| Category | Size | Percentage |')
      markdownSections.push('| --- | --- | --- |')
      markdownSections.push(
        `| Code | ${escapeMarkdown(formatSizeWithCompression(result.breakdown.code, result.breakdownGzip?.code))} | ${codePct.toFixed(1)}% |`
      )
      markdownSections.push(
        `| CSS | ${escapeMarkdown(formatSizeWithCompression(result.breakdown.css, result.breakdownGzip?.css))} | ${cssPct.toFixed(1)}% |`
      )
      markdownSections.push('')

      const chunks = processChunks(result.chunks)

      if (chunks.length === 0) {
        markdownSections.push('No chunks found\n')
      } else {
        markdownSections.push('**Chunks:**\n')
        markdownSections.push('| Chunk | Size |')
        markdownSections.push('| --- | --- |')

        for (const chunk of chunks) {
          markdownSections.push(`| ${escapeMarkdown(chunk.name)} | ${escapeMarkdown(formatSize(chunk.size))} |`)
        }

        markdownSections.push(`| **Total** | **${escapeMarkdown(formatSizeWithCompression(result.totalSize, result.totalSizeGzip))}** |`)
      }

      // Duplicate packages section
      if (hasDuplicates && result.duplicates.duplicateCount > 0) {
        markdownSections.push(`\n**Duplicate Packages (${result.duplicates.duplicateCount}):**\n`)
        markdownSections.push('| Package Name | Occurrences | Total Size | Wasted Size | Chunks |')
        markdownSections.push('| --- | --- | --- | --- | --- |')

        for (const dup of result.duplicates.packages) {
          const {wastedSize} = calculateDuplicateSizes(dup.totalSize, dup.occurrences)
          const chunksList = dup.chunks.join(', ')
          markdownSections.push(
            `| ${escapeMarkdown(dup.packageName)} | ${dup.occurrences} | ${escapeMarkdown(formatSize(dup.totalSize))} | ${escapeMarkdown(formatSize(wastedSize))} | ${escapeMarkdown(chunksList)} |`
          )
        }

        markdownSections.push(`| **Total Wasted Size** | | | **${escapeMarkdown(formatSize(result.duplicates.totalDuplicateSize))}** | |`)
      }

      markdownSections.push('')
    }
  }

  const markdown = markdownSections.join('\n')
  const markdownPath = join(statsDir, 'bundle-sizes-report.mdx')
  writeFileSync(markdownPath, markdown, 'utf-8')
  console.log(`📄 Markdown report exported to: ${markdownPath}`)
}
