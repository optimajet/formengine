import {copyFile, mkdir, readdir, readFile, writeFile} from 'node:fs/promises'
import {join, normalize, resolve} from 'node:path'
import {exportsToEntries, getDirname, getFilesByMask, readPackageJson} from '@react-form-builder/cli-lib/view-pack-tools'
import postcss from 'postcss'
import type {ModuleFormat} from 'rollup'
import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle'
import {defineConfig, mergeConfig, Plugin, ResolvedConfig} from 'vite'
import {inlineCssPlugin} from 'vite-inline-css-plugin'
import base from '../../../vite.config'
import {libDts} from '../../../vite-plugin-api-extractor.ts'

const __dirname = getDirname(import.meta.url)

const cmpPath = resolve(__dirname, './src/components')
const oneFileComponents = getFilesByMask(cmpPath, /.*[.]tsx/)
const allComponents = [...oneFileComponents]

const packageJson = readPackageJson(__dirname)

const entry = exportsToEntries(__dirname, packageJson)

const entryFilePaths = new Set(
  Object.values(entry)
    .filter(filePath => normalize(filePath).includes(normalize(cmpPath)))
    .map(filePath => normalize(filePath))
)

const allComponentsNormalized = allComponents.map(filePath => normalize(filePath))
const missingInEntry = allComponentsNormalized.filter(filePath => !entryFilePaths.has(filePath))

if (missingInEntry.length > 0) {
  console.error('Error: The following component files are not exported in package.json:')
  missingInEntry.forEach(filePath => {
    console.error(`  - ${filePath}`)
  })
  console.error('\nPlease add these files to the exports section in package.json')
  process.exit(1)
}

const sourceMapCommentPattern = /\/\*# sourceMappingURL=.*?\*\/\s*$/gm

const readCss = async (cssPath: string) => {
  const css = await readFile(cssPath, 'utf8')
  return css.replace(sourceMapCommentPattern, '').trimEnd()
}

const composeCss = async (outputPath: string, parts: string[]) => {
  const composedCss = `${parts.join('\n')}\n`
  const result = await postcss([]).process(composedCss, {
    from: outputPath,
    to: outputPath,
    map: {inline: false, annotation: true},
  })

  await writeFile(outputPath, result.css, 'utf8')
  if (result.map) {
    await writeFile(`${outputPath}.map`, result.map.toString(), 'utf8')
  }
}

const cssModuleFilePatterns = {
  ltr: /^rsuite-ltr\.css-.*\.js$/,
  rtl: /^rsuite-rtl\.css-.*\.js$/,
}

const toDataCssUrl = (css: string) => {
  const encoded = Buffer.from(css, 'utf8').toString('base64')
  return `data:text/css;base64,${encoded}`
}

const toCssUrlModuleContent = (href: string) => `const t = ${JSON.stringify(href)};
export {
  t as default
};
`

const replaceGeneratedCssUrlModule = async (outDir: string, direction: 'ltr' | 'rtl', href: string) => {
  const fileNames = await readdir(outDir)
  const pattern = cssModuleFilePatterns[direction]
  const moduleFileName = fileNames.find(fileName => pattern.test(fileName))

  if (!moduleFileName) {
    throw new Error(`Could not find generated ${direction.toUpperCase()} CSS URL module in ${outDir}`)
  }

  await writeFile(join(outDir, moduleFileName), toCssUrlModuleContent(href), 'utf8')
}

const composeRsuiteCssPlugin = (): Plugin => {
  let outDir = ''
  const publicCssDir = join(__dirname, './public/css')

  return {
    name: 'compose-rsuite-dist-css',
    apply: 'build',
    configResolved(config: ResolvedConfig) {
      outDir = resolve(config.build.outDir)
    },
    async closeBundle() {
      console.info('Composing RSuite CSS files...')

      const assetsDir = join(outDir, 'assets')
      const generatedCssPath = join(assetsDir, 'styles.css')
      const ltrOutputPath = join(assetsDir, 'styles.ltr.css')
      const rtlOutputPath = join(assetsDir, 'styles.rtl.css')
      const commonCssPath = join(publicCssDir, 'formengine-rsuite.css')
      const ltrRsuiteCssPath = join(publicCssDir, 'rsuite-no-reset.min.css')
      const rtlRsuiteCssPath = join(publicCssDir, 'rsuite-no-reset-rtl.min.css')

      // Copy CSS files to dist/css directory
      console.info('Copying CSS files to dist/css...')
      const distCssDir = join(outDir, 'css')
      await mkdir(distCssDir, {recursive: true})
      console.info('Copying formengine-rsuite.css...')
      await copyFile(commonCssPath, join(distCssDir, 'formengine-rsuite.css'))
      console.info('Copying rsuite-no-reset.min.css...')
      await copyFile(ltrRsuiteCssPath, join(distCssDir, 'rsuite-no-reset.min.css'))
      console.info('Copying rsuite-no-reset-rtl.min.css...')
      await copyFile(rtlRsuiteCssPath, join(distCssDir, 'rsuite-no-reset-rtl.min.css'))
      console.info('CSS files copied successfully')

      try {
        const generatedCss = await readCss(generatedCssPath)
        const commonCss = await readCss(commonCssPath)
        const ltrRsuiteCss = await readCss(ltrRsuiteCssPath)
        const rtlRsuiteCss = await readCss(rtlRsuiteCssPath)

        await composeCss(ltrOutputPath, [generatedCss, commonCss, ltrRsuiteCss])
        await composeCss(rtlOutputPath, [generatedCss, commonCss, rtlRsuiteCss])

        console.info('Successfully composed RSuite CSS files:', ltrOutputPath, rtlOutputPath)

        const ltrComposedCss = await readCss(ltrOutputPath)
        const rtlComposedCss = await readCss(rtlOutputPath)
        await replaceGeneratedCssUrlModule(outDir, 'ltr', toDataCssUrl(ltrComposedCss))
        await replaceGeneratedCssUrlModule(outDir, 'rtl', toDataCssUrl(rtlComposedCss))
      } catch (error) {
        console.error('Failed to compose RSuite CSS files:', error)
        throw error
      }
    },
  }
}

export default defineConfig(env =>
  mergeConfig(base(env), {
    plugins: [libDts(), inlineCssPlugin(), composeRsuiteCssPlugin()],
    build: {
      sourcemap: true,
      assetsInlineLimit: 0, // don't inline
      lib: {
        entry,
        formats: ['es'],
        fileName: (_: ModuleFormat, entryName: string) => {
          if (entryName === 'index') {
            return 'index.js'
          }
          return `${entryName}.js`
        },
        cssFileName: 'assets/styles',
      },
      rollupOptions: {
        plugins: [excludeDependenciesFromBundle({dependencies: true, peerDependencies: true})],
        output: {
          exports: 'named',
        },
      },
    },
  })
)
