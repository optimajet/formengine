import {normalize, resolve} from 'node:path'
import type {ModuleFormat} from 'rollup'
import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle'
import {defineConfig, mergeConfig} from 'vite'
import {inlineCssPlugin} from 'vite-inline-css-plugin'
import dts from 'vite-plugin-dts'
import base from '../../../vite.config'
import {exportsToEntries, getDirname, getFilesByMask, readPackageJson} from './config/build-tools'

const __dirname = getDirname(import.meta.url)

const cmpPath = resolve(__dirname, './src/components')
const oneFileComponents = getFilesByMask(cmpPath, /.*[.]tsx/)
const allComponents = [...oneFileComponents]

const packageJson = readPackageJson('.')

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

export default defineConfig(env =>
  mergeConfig(base(env), {
    // publicDir: false, // do not copy static files
    plugins: [dts({rollupTypes: true, tsconfigPath: './bundle.tsconfig.json'}), inlineCssPlugin()],
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
