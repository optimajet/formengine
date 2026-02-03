/**
 * Escapes HTML special characters.
 * @param value value to escape
 * @returns escaped HTML string
 */
export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/**
 * Generates SVG performance chart HTML.
 * @param width chart width
 * @param height chart height
 * @param gridLines array of grid line HTML strings
 * @param bars array of bar HTML strings
 * @param yAxisLabels array of Y-axis label HTML strings
 * @param labels array of label HTML strings
 * @param padding chart padding object
 * @returns SVG HTML string
 */
export function generatePerformanceChartSVG(
  width: number,
  height: number,
  gridLines: string[],
  bars: string[],
  yAxisLabels: string[],
  labels: string[],
  padding: {top: number; right: number; bottom: number; left: number}
): string {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="white"/>
      ${gridLines.join('')}
      ${bars.join('')}
      ${yAxisLabels.join('')}
      ${labels.join('')}
      <text x="${width / 2}" y="${height - 15}" text-anchor="middle" font-size="14" font-weight="600" fill="#333">Performance Comparison: Slow 3G vs Average 4G</text>
      <g transform="translate(${width - padding.right + 10}, ${padding.top + 10})">
        <text x="0" y="0" font-size="12" font-weight="600" fill="#333">Legend:</text>
      </g>
      <g transform="translate(${width - padding.right + 10}, ${padding.top + 30})">
        <rect width="14" height="14" fill="#2E7D32" opacity="0.8"/>
        <text x="18" y="12" font-size="11" fill="#333">3G LCP</text>
      </g>
      <g transform="translate(${width - padding.right + 10}, ${padding.top + 50})">
        <rect width="14" height="14" fill="#4CAF50" opacity="0.8"/>
        <text x="18" y="12" font-size="11" fill="#333">4G LCP</text>
      </g>
      <g transform="translate(${width - padding.right + 10}, ${padding.top + 70})">
        <rect width="14" height="14" fill="#1565C0" opacity="0.8"/>
        <text x="18" y="12" font-size="11" fill="#333">3G TTI</text>
      </g>
      <g transform="translate(${width - padding.right + 10}, ${padding.top + 90})">
        <rect width="14" height="14" fill="#2196F3" opacity="0.8"/>
        <text x="18" y="12" font-size="11" fill="#333">4G TTI</text>
      </g>
      <g transform="translate(${width - padding.right + 10}, ${padding.top + 110})">
        <rect width="14" height="14" fill="#FF9800" opacity="0.8"/>
        <text x="18" y="12" font-size="11" fill="#333">Parse</text>
      </g>
    </svg>`
}

/**
 * Generates a table row for summary by app with multiple build tools.
 * @param variantLink HTML link to variant detail
 * @param buildTool build tool name
 * @param totalSize formatted total size HTML
 * @param chunkCount number of chunks
 * @param codeSize formatted code size HTML
 * @param cssSize formatted CSS size HTML
 * @param duplicateCount number of duplicates
 * @param wastedSize formatted wasted size
 * @param hasDuplicates whether to include duplicate columns
 * @returns table row HTML string
 */
export function generateSummaryByAppRowMultipleTools(
  variantLink: string,
  buildTool: string,
  totalSize: string,
  chunkCount: number,
  codeSize: string,
  cssSize: string,
  duplicateCount: number,
  wastedSize: string,
  hasDuplicates: boolean = true
): string {
  const duplicateCols = hasDuplicates ? `<td>${duplicateCount}</td><td>${wastedSize}</td>` : ''
  return `<tr>
            <td>${variantLink}</td>
            <td>${buildTool}</td>
            <td>${totalSize}</td>
            <td>${chunkCount}</td>
            <td>${codeSize}</td>
            <td>${cssSize}</td>
            ${duplicateCols}
          </tr>`
}

/**
 * Generates a table row for summary by app without multiple build tools.
 * @param variantLink HTML link to variant detail
 * @param totalSize formatted total size HTML
 * @param chunkCount number of chunks
 * @param codeSize formatted code size HTML
 * @param cssSize formatted CSS size HTML
 * @param duplicateCount number of duplicates
 * @param wastedSize formatted wasted size
 * @param hasDuplicates whether to include duplicate columns
 * @returns table row HTML string
 */
export function generateSummaryByAppRowSingleTool(
  variantLink: string,
  totalSize: string,
  chunkCount: number,
  codeSize: string,
  cssSize: string,
  duplicateCount: number,
  wastedSize: string,
  hasDuplicates: boolean = true
): string {
  const duplicateCols = hasDuplicates ? `<td>${duplicateCount}</td><td>${wastedSize}</td>` : ''
  return `<tr>
            <td>${variantLink}</td>
            <td>${totalSize}</td>
            <td>${chunkCount}</td>
            <td>${codeSize}</td>
            <td>${cssSize}</td>
            ${duplicateCols}
          </tr>`
}

/**
 * Generates table header row for summary by app with multiple build tools.
 * @param hasDuplicates whether to include duplicate columns
 * @returns header row HTML string
 */
export function generateSummaryByAppHeaderMultipleTools(hasDuplicates: boolean = true): string {
  const duplicateCols = hasDuplicates ? '<th>Duplicates</th><th>Wasted Size</th>' : ''
  return `<tr><th>Variant</th><th>Build Tool</th><th>Total Size<sub>(raw/gzip)</sub></th><th>Chunks</th><th>Code<sub>(raw/gzip)</sub></th><th>CSS<sub>(raw/gzip)</sub></th>${duplicateCols}</tr>`
}

/**
 * Generates table header row for summary by app without multiple build tools.
 * @param hasDuplicates whether to include duplicate columns
 * @returns header row HTML string
 */
export function generateSummaryByAppHeaderSingleTool(hasDuplicates: boolean = true): string {
  const duplicateCols = hasDuplicates ? '<th>Duplicates</th><th>Wasted Size</th>' : ''
  return `<tr><th>Variant</th><th>Total Size<sub>(raw/gzip)</sub></th><th>Chunks</th><th>Code<sub>(raw/gzip)</sub></th><th>CSS<sub>(raw/gzip)</sub></th>${duplicateCols}</tr>`
}

/**
 * Generates app section HTML.
 * @param appSectionId section ID
 * @param appName app name
 * @param headerRow table header row HTML
 * @param rows table rows HTML
 * @returns section HTML string
 */
export function generateAppSection(appSectionId: string, appName: string, headerRow: string, rows: string): string {
  return `<section id="${appSectionId}"><h2>${escapeHtml(appName)}</h2><table><thead>${headerRow}</thead><tbody>${rows}</tbody></table></section>`
}

/**
 * Generates a table row for summary by variant with multiple build tools.
 * @param appName app name
 * @param buildTool build tool name
 * @param totalSizeCell formatted total size cell HTML (includes <td and class)
 * @param chunkCount number of chunks
 * @param codeSizeCell formatted code size cell HTML (includes <td and class)
 * @param cssSizeCell formatted CSS size cell HTML (includes <td and class)
 * @param duplicateCount number of duplicates
 * @param wastedSizeCell formatted wasted size cell HTML (includes <td and class)
 * @param hasDuplicates whether to include duplicate columns
 * @returns table row HTML string
 */
export function generateSummaryByVariantRowMultipleTools(
  appName: string,
  buildTool: string,
  totalSizeCell: string,
  chunkCount: number,
  codeSizeCell: string,
  cssSizeCell: string,
  duplicateCount: number,
  wastedSizeCell: string,
  hasDuplicates: boolean = true
): string {
  const duplicateCols = hasDuplicates ? `<td>${duplicateCount}</td><td${wastedSizeCell}</td>` : ''
  return `<tr>
            <td>${escapeHtml(appName)}</td>
            <td>${escapeHtml(buildTool)}</td>
            <td${totalSizeCell}</td>
            <td>${chunkCount}</td>
            <td${codeSizeCell}</td>
            <td${cssSizeCell}</td>
            ${duplicateCols}
          </tr>`
}

/**
 * Generates a table row for summary by variant without multiple build tools.
 * @param appName app name
 * @param totalSizeCell formatted total size cell HTML (includes <td and class)
 * @param chunkCount number of chunks
 * @param codeSizeCell formatted code size cell HTML (includes <td and class)
 * @param cssSizeCell formatted CSS size cell HTML (includes <td and class)
 * @param duplicateCount number of duplicates
 * @param wastedSizeCell formatted wasted size cell HTML (includes <td and class)
 * @param hasDuplicates whether to include duplicate columns
 * @returns table row HTML string
 */
export function generateSummaryByVariantRowSingleTool(
  appName: string,
  totalSizeCell: string,
  chunkCount: number,
  codeSizeCell: string,
  cssSizeCell: string,
  duplicateCount: number,
  wastedSizeCell: string,
  hasDuplicates: boolean = true
): string {
  const duplicateCols = hasDuplicates ? `<td>${duplicateCount}</td><td${wastedSizeCell}</td>` : ''
  return `<tr>
            <td>${escapeHtml(appName)}</td>
            <td${totalSizeCell}</td>
            <td>${chunkCount}</td>
            <td${codeSizeCell}</td>
            <td${cssSizeCell}</td>
            ${duplicateCols}
          </tr>`
}

/**
 * Generates table header row for summary by variant with multiple build tools.
 * @param hasDuplicates whether to include duplicate columns
 * @returns header row HTML string
 */
export function generateSummaryByVariantHeaderMultipleTools(hasDuplicates: boolean = true): string {
  const duplicateCols = hasDuplicates ? '<th>Duplicates</th><th>Wasted Size</th>' : ''
  return `<tr><th>App</th><th>Build Tool</th><th>Total Size<sub>(raw/gzip)</sub></th><th>Chunks</th><th>Code<sub>(raw/gzip)</sub></th><th>CSS<sub>(raw/gzip)</sub></th>${duplicateCols}</tr>`
}

/**
 * Generates table header row for summary by variant without multiple build tools.
 * @param hasDuplicates whether to include duplicate columns
 * @returns header row HTML string
 */
export function generateSummaryByVariantHeaderSingleTool(hasDuplicates: boolean = true): string {
  const duplicateCols = hasDuplicates ? '<th>Duplicates</th><th>Wasted Size</th>' : ''
  return `<tr><th>App</th><th>Total Size<sub>(raw/gzip)</sup></th><th>Chunks</th><th>Code<sub>(raw/gzip)</sub></th><th>CSS<sub>(raw/gzip)</sub></th>${duplicateCols}</tr>`
}

/**
 * Generates variant section HTML with performance charts.
 * @param variantName variant name
 * @param headerRow table header row HTML
 * @param rows table rows HTML
 * @param combinedChart performance chart SVG HTML
 * @param hiddenVegaLiteCode hidden Vega-Lite chart code HTML
 * @returns section HTML string
 */
export function generateVariantSection(
  variantName: string,
  headerRow: string,
  rows: string,
  combinedChart: string,
  hiddenVegaLiteCode: string
): string {
  return `<section><h2>${escapeHtml(variantName.toUpperCase())}</h2><table><thead>${headerRow}</thead><tbody>${rows}</tbody></table><div class="legend">📊 <strong>Legend:</strong> Highlighted cells indicate the smallest value in each comparison. Smaller is better.</div>
      <div class="performance-charts-section">
        <h3>Performance Comparison (using gzip sizes)</h3>
        <div class="performance-charts-container">
          <div class="performance-chart-wrapper">
<!--            <button class="copy-vega-lite-btn" data-chart-id="performance-${variantName}" data-chart-type="vega-lite" title="Copy Vega-Lite chart JSON to clipboard">📋 Vega</button>-->
            <div class="performance-chart">${combinedChart}</div>
          </div>
        </div>
      </div>${hiddenVegaLiteCode}</section>`
}

/**
 * Generates matrix table cell HTML.
 * @param value formatted size value
 * @param diffHint difference hint HTML
 * @param cellClass CSS class for cell (empty string or ' class="smallest"')
 * @returns table cell HTML string
 */
export function generateMatrixCell(value: string, diffHint: string, cellClass: string): string {
  return `<td${cellClass}>${value}${diffHint}</td>`
}

/**
 * Generates N/A matrix table cell HTML.
 * @returns table cell HTML string
 */
export function generateMatrixCellNA(): string {
  return '<td>N/A</td>'
}

/**
 * Generates matrix table row HTML.
 * @param appLink HTML link to app section
 * @param cells table cells HTML
 * @returns table row HTML string
 */
export function generateMatrixRow(appLink: string, cells: string): string {
  return `<tr><td>${appLink}</td>${cells}</tr>`
}

/**
 * Generates breakdown table HTML.
 * @param codeSize formatted code size HTML
 * @param codePct code percentage
 * @param cssSize formatted CSS size HTML
 * @param cssPct CSS percentage
 * @returns breakdown table HTML string
 */
export function generateBreakdownTable(codeSize: string, codePct: number, cssSize: string, cssPct: number): string {
  return `<table class="breakdown-table">
          <thead><tr><th>Category</th><th>Size<sub>(raw/gzip)</sub></th><th>Percentage</th></tr></thead>
          <tbody>
            <tr><td>Code</td><td>${codeSize}</td><td>${codePct.toFixed(1)}%</td></tr>
            <tr><td>CSS</td><td>${cssSize}</td><td>${cssPct.toFixed(1)}%</td></tr>
          </tbody>
        </table>`
}

/**
 * Generates duplicate packages table HTML.
 * @param duplicateCount number of duplicate packages
 * @param duplicateRows table rows for duplicate packages
 * @param totalWastedSize formatted total wasted size
 * @returns duplicates table HTML string
 */
export function generateDuplicatesTable(duplicateCount: number, duplicateRows: string, totalWastedSize: string): string {
  return `<h4>Duplicate Packages (${duplicateCount})</h4>
            <table>
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Occurrences</th>
                  <th>Total Size</th>
                  <th>Wasted Size</th>
                  <th>Chunks</th>
                </tr>
              </thead>
              <tbody>
                ${duplicateRows}
                <tr class="total-row">
                  <td colspan="3"><strong>Total Wasted Size</strong></td>
                  <td colspan="2"><strong>${totalWastedSize}</strong></td>
                </tr>
              </tbody>
            </table>`
}

/**
 * Generates no duplicates message HTML.
 * @returns no duplicates message HTML string
 */
export function generateNoDuplicatesMessage(): string {
  return '<p>✅ No duplicate packages found</p>'
}

/**
 * Generates duplicate package table row HTML.
 * @param packageName package name
 * @param occurrences number of occurrences
 * @param totalSize formatted total size
 * @param wastedSize formatted wasted size
 * @param chunksList comma-separated list of chunks
 * @returns table row HTML string
 */
export function generateDuplicateRow(
  packageName: string,
  occurrences: number,
  totalSize: string,
  wastedSize: string,
  chunksList: string
): string {
  return `<tr>
                <td>${escapeHtml(packageName)}</td>
                <td>${occurrences}</td>
                <td>${escapeHtml(totalSize)}</td>
                <td>${escapeHtml(wastedSize)}</td>
                <td>${escapeHtml(chunksList)}</td>
              </tr>`
}

/**
 * Generates chunk table row HTML.
 * @param chunkName chunk name
 * @param chunkSize formatted chunk size
 * @returns table row HTML string
 */
export function generateChunkRow(chunkName: string, chunkSize: string): string {
  return `<tr><td>${escapeHtml(chunkName)}</td><td>${escapeHtml(chunkSize)}</td></tr>`
}

/**
 * Generates no chunks found row HTML.
 * @returns table row HTML string
 */
export function generateNoChunksRow(): string {
  return '<tr><td colspan="2">No chunks found</td></tr>'
}

/**
 * Generates total row HTML for chunk table.
 * @param totalSize formatted total size HTML
 * @returns table row HTML string
 */
export function generateChunkTotalRow(totalSize: string): string {
  return `<tr class="total-row"><td>Total<sub>(raw/gzip)</sub></td><td>${totalSize}</td></tr>`
}

/**
 * Generates detailed variant section HTML.
 * @param detailId section detail ID
 * @param variantLabel variant label
 * @param pieChartId pie chart ID for Vega-Lite button
 * @param rawPieChart raw pie chart SVG HTML
 * @param gzipPieChart gzip pie chart SVG HTML (optional)
 * @param breakdownTable breakdown table HTML
 * @param chunkRows chunk table rows HTML
 * @param totalRow total row HTML
 * @param duplicatesTable duplicates table HTML
 * @param hiddenVegaLitePieCode hidden Vega-Lite pie chart code HTML
 * @returns section HTML string
 */
export function generateDetailedVariantSection(
  detailId: string,
  variantLabel: string,
  pieChartId: string,
  rawPieChart: string,
  gzipPieChart: string,
  breakdownTable: string,
  chunkRows: string,
  totalRow: string,
  duplicatesTable: string,
  hiddenVegaLitePieCode: string
): string {
  const gzipPieChartHtml = gzipPieChart
    ? `<div class="pie-chart-wrapper">
                <div class="pie-chart">${gzipPieChart}</div>
              </div>`
    : ''

  return `<section id="${detailId}">
          <h3>Variant: ${variantLabel}</h3>
          <div class="breakdown-container">
            <div class="pie-charts-row">
              <div class="pie-chart-wrapper">
<!--              <button class="copy-vega-lite-pie-btn" data-chart-id="${pieChartId}" data-chart-type="vega-lite" title="Copy Vega-Lite chart JSON to clipboard">📋 Vega</button>-->
                <div class="pie-chart">${rawPieChart}</div>
              </div>
              ${gzipPieChartHtml}
            </div>
            <div class="breakdown-table-container">
              ${breakdownTable}
            </div>
          </div>
          <table><thead><tr><th>Chunk</th><th>Size</th></tr></thead><tbody>${chunkRows}${totalRow}</tbody></table>
          ${duplicatesTable}${hiddenVegaLitePieCode}
        </section>`
}

/**
 * Generates app detail section HTML.
 * @param appName app name
 * @param variantsHtml variants HTML content
 * @returns section HTML string
 */
export function generateAppDetailSection(appName: string, variantsHtml: string): string {
  return `<section><h2>${escapeHtml(appName)}</h2>${variantsHtml}</section>`
}

/**
 * Generates hidden Vega-Lite code div HTML.
 * @param chartId chart ID
 * @param chartJson chart JSON as string
 * @returns hidden div HTML string
 */
export function generateHiddenVegaLiteCode(chartId: string, chartJson: string): string {
  return `<div class="hidden-vega-lite-code" data-chart-id="${chartId}" style="display: none;">${escapeHtml(chartJson)}</div>`
}

/**
 * Generates main HTML document.
 * @param activeBuildTools list of active build tools
 * @param matrixHeaderCells matrix header cells HTML
 * @param matrixRowsNonMui non-MUI matrix rows HTML
 * @param matrixRowsMui MUI matrix rows HTML
 * @param summaryByAppSections summary by app sections HTML
 * @param summaryByVariantSections summary by variant sections HTML
 * @param detailedSections detailed sections HTML
 * @returns complete HTML document string
 */
export function generateHTMLDocument(
  activeBuildTools: readonly string[],
  matrixHeaderCells: string,
  matrixRowsNonMui: string,
  matrixRowsMui: string,
  summaryByAppSections: string[],
  summaryByVariantSections: string[],
  detailedSections: string[],
  nonMuiLibTitles: string,
  muiLibTitles: string
): string {
  const buildToolsNote =
    activeBuildTools.length > 1
      ? `<p class="muted">Build Tools: ${activeBuildTools.map(t => escapeHtml(t.toUpperCase())).join(', ')}</p>`
      : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Bundle Size Report</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 24px; line-height: 1.5; }
    h1 { margin-bottom: 8px; }
    h2 { margin-top: 32px; margin-bottom: 8px; }
    h3 { margin-top: 16px; margin-bottom: 4px; }
    h4 { margin-top: 12px; margin-bottom: 4px; font-size: 14px; }
    section { margin-bottom: 24px; }
    table { border-collapse: collapse; width: 100%; margin-top: 8px; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; font-size: 13px; }
    th { background-color: #f4f4f4; }
    tr:nth-child(even) { background-color: #fafafa; }
    .total-row { font-weight: 600; background-color: #f0f7ff; }
    .matrix-table th, .matrix-table td { text-align: center; }
    a { color: #0066cc; text-decoration: none; }
    a:hover { text-decoration: underline; }
    section[id] { scroll-margin-top: 20px; }
    sub { vertical-align: baseline; margin-left: 0.5ch }
    .diff-hint { color: #666; font-size: 11px; font-weight: normal; }
    .performance-charts-section { margin: 32px 0; padding: 20px; background-color: #f9f9f9; border-radius: 4px; }
    .performance-charts-section h3 { margin-top: 0; margin-bottom: 20px; }
    .performance-charts-container { display: flex; gap: 24px; flex-wrap: wrap; justify-content: center; }
    .performance-chart-wrapper { position: relative; flex: 1; min-width: 400px; max-width: 100%; }
    .performance-chart { width: 100%; }
    .performance-chart svg { width: 100%; height: auto; border: 1px solid #e0e0e0; border-radius: 4px; background-color: white; }
    .copy-vega-lite-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 6px 12px;
      background-color: #FF9800;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transition: background-color 0.2s, opacity 0.2s;
      opacity: 0;
      pointer-events: none;
    }
    .performance-chart-wrapper:hover .copy-vega-lite-btn {
      opacity: 1;
      pointer-events: auto;
    }
    .copy-vega-lite-btn:hover {
      background-color: #F57C00;
    }
    .copy-vega-lite-btn:active {
      background-color: #E65100;
    }
    .copy-vega-lite-btn.copied {
      background-color: #2196F3;
      opacity: 1;
      pointer-events: auto;
    }
    .hidden-vega-lite-code { display: none; }
    .muted { color: #666; font-size: 12px; }
    .smallest { background-color: #e8f5e9; font-weight: 600; }
    .legend { margin: 16px 0; padding: 12px; background-color: #f5f5f5; border-left: 4px solid #4CAF50; font-size: 13px; }
    .breakdown-container { display: grid; grid-template-columns: 1fr 1fr auto; gap: 16px; margin: 16px 0; align-items: flex-start; }
    .pie-charts-row { display: flex; flex-wrap: wrap; gap: 24px; width: 100%; }
    .breakdown-container svg { flex-shrink: 0; }
    .breakdown-table-container { flex: 1; width: 100%; }
    .breakdown-table { width: auto; min-width: 300px; }
    .pie-chart-wrapper { position: relative; }
    .copy-vega-lite-pie-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 6px 12px;
      background-color: #FF9800;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      z-index: 10;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transition: background-color 0.2s, opacity 0.2s;
      opacity: 0;
      pointer-events: none;
    }
    .pie-chart-wrapper:hover .copy-vega-lite-pie-btn {
      opacity: 1;
      pointer-events: auto;
    }
    .copy-vega-lite-pie-btn:hover {
      background-color: #F57C00;
    }
    .copy-vega-lite-pie-btn:active {
      background-color: #E65100;
    }
    .copy-vega-lite-pie-btn.copied {
      background-color: #2196F3;
      opacity: 1;
      pointer-events: auto;
    }
    @media (max-width: 768px) {
      .breakdown-container { flex-direction: column; }
    }
  </style>
</head>
<body>
  <h1>Bundle Size Report</h1>
<!--  <p class="muted">Generated at ${escapeHtml(new Date().toISOString())}</p>-->
  ${buildToolsNote}

  <section>
    <h2>Summary Matrix (Total Size)</h2>
    <h3>Non-MUI${nonMuiLibTitles ? ` (${escapeHtml(nonMuiLibTitles)})` : ''}</h3>
    <table class="matrix-table">
      <thead>
        <tr>
          <th>App</th>
          ${matrixHeaderCells}
        </tr>
      </thead>
      <tbody>
        ${matrixRowsNonMui}
      </tbody>
    </table>
    <div class="legend">📊 <strong>Legend:</strong> Highlighted cells indicate the smallest value in each comparison. Smaller is better.</div>
    <h3>MUI${muiLibTitles ? ` (${escapeHtml(muiLibTitles)})` : ''}</h3>
    <table class="matrix-table">
      <thead>
        <tr>
          <th>App</th>
          ${matrixHeaderCells}
        </tr>
      </thead>
      <tbody>
        ${matrixRowsMui}
      </tbody>
    </table>
    <div class="legend">📊 <strong>Legend:</strong> Highlighted cells indicate the smallest value in each comparison. Smaller is better.</div>
  </section>

  <section>
    <h2>Comparison by App</h2>
    ${summaryByAppSections.join('')}
  </section>

  <section>
    <h2>Comparison by Variant</h2>
    ${summaryByVariantSections.join('')}
  </section>

  <section>
    <h2>Detailed Chunk Information</h2>
    ${detailedSections.join('')}
  </section>
  </body>
</html>
`
}
