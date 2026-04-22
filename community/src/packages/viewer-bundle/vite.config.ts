import {readdirSync} from 'node:fs'
import {readFile, unlink, writeFile} from 'node:fs/promises'
import path from 'path'
import type {ModuleFormat} from 'rollup'
// @ts-ignore
import {fileURLToPath} from 'url'
import type {Plugin, ResolvedConfig} from 'vite'
import {defineConfig, mergeConfig} from 'vite'
import {inlineCssPlugin} from 'vite-inline-css-plugin'
import base from '../../vite.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sourceMapCommentPattern = /\/\*# sourceMappingURL=.*?\*\/\s*$/gm

const readCss = async (cssPath: string): Promise<string> => {
  const css = await readFile(cssPath, 'utf8')
  return css.replace(sourceMapCommentPattern, '').trimEnd()
}

const composeCss = async (outputPath: string, parts: string[]): Promise<void> => {
  const composedCss = `${parts.join('\n')}\n`
  await writeFile(outputPath, composedCss, 'utf8')
}

const toDataCssUrl = (css: string) => {
  const encoded = Buffer.from(css, 'utf8').toString('base64')
  return `data:text/css;base64,${encoded}`
}

const composeViewerDistCssPlugin = (): Plugin => {
  let outDir = ''

  return {
    name: 'compose-viewer-dist-css',
    apply: 'build',
    configResolved(config: ResolvedConfig) {
      outDir = path.resolve(config.build.outDir)
    },
    async closeBundle() {
      const rsuiteCssSrc = path.resolve(__dirname, '../views/rsuite/public/css')
      const rsuiteCssFiles = readdirSync(rsuiteCssSrc).filter(f => f.endsWith('.css'))

      // Copy rsuite CSS files to dist
      for (const file of rsuiteCssFiles) {
        const src = path.join(rsuiteCssSrc, file)
        const dest = path.join(outDir, file)
        await writeFile(dest, await readFile(src, 'utf8'), 'utf8')
      }

      const bundleCssPath = path.join(outDir, 'viewer-bundle.css')
      const formengineRsuitePath = path.join(outDir, 'formengine-rsuite.css')
      const rsuiteLtrPath = path.join(outDir, 'rsuite-no-reset.min.css')
      const rsuiteRtlPath = path.join(outDir, 'rsuite-no-reset-rtl.min.css')

      const ltrOutputPath = path.join(outDir, 'viewer-bundle-ltr.css')
      const rtlOutputPath = path.join(outDir, 'viewer-bundle-rtl.css')

      const bundleCss = await readCss(bundleCssPath)
      const formengineRsuite = await readCss(formengineRsuitePath)
      const rsuiteLtr = await readCss(rsuiteLtrPath)
      const rsuiteRtl = await readCss(rsuiteRtlPath)

      await composeCss(ltrOutputPath, [bundleCss, formengineRsuite, rsuiteLtr])
      await composeCss(rtlOutputPath, [bundleCss, formengineRsuite, rsuiteRtl])

      // Replace CSS data URLs in JS bundles with composed CSS data URLs
      const ltrDataUrl = toDataCssUrl(await readCss(ltrOutputPath))
      const rtlDataUrl = toDataCssUrl(await readCss(rtlOutputPath))

      const dataUrlPattern = /data:text\/css;base64,[A-Za-z0-9+/=]*/g

      // Find all JS files in dist and update their embedded CSS data URLs
      const jsFiles = readdirSync(outDir).filter(f => f.endsWith('.js'))
      for (const jsFile of jsFiles) {
        const filePath = path.join(outDir, jsFile)
        let content = await readFile(filePath, 'utf8')

        const matches = content.match(dataUrlPattern)
        if (matches && matches.length >= 2) {
          // Replace first match with LTR, second with RTL
          let ltrReplaced = false
          content = content.replace(dataUrlPattern, () => {
            ltrReplaced = !ltrReplaced
            return ltrReplaced ? ltrDataUrl : rtlDataUrl
          })
          await writeFile(filePath, content, 'utf8')
        }
      }

      // Remove intermediate rsuite stub files
      await unlink(path.join(outDir, 'rsuite-ltr.css'))
      await unlink(path.join(outDir, 'rsuite-rtl.css'))
      await unlink(bundleCssPath)
    },
  }
}

export default defineConfig(env =>
  mergeConfig(base(env), {
    // with this setting only the production version of React will be included in the bundle
    define: {'process.env.NODE_ENV': '"production"'},
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        formats: ['umd', 'iife'],
        fileName: (format: ModuleFormat) => `index.${format}.js`,
        name: 'FormEngineViewerBundle',
      },
    },
    plugins: [inlineCssPlugin(), composeViewerDistCssPlugin()],
    resolve: {
      dedupe: ['react', 'react-dom', 'react-is'],
    },
  })
)
