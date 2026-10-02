import path from 'node:path'
import {fileURLToPath} from 'node:url'
import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle'
import {defineConfig, mergeConfig} from 'vite'
import base from '../../../vite.config'
import {libDts} from '../../../vite-plugin-api-extractor.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(env =>
  mergeConfig(base(env), {
    plugins: [libDts()],
    build: {
      sourcemap: true,
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        formats: ['es'],
        fileName: 'index',
        cssFileName: 'assets/styles',
      },
      rollupOptions: {
        plugins: [excludeDependenciesFromBundle({dependencies: true, peerDependencies: true})],
      },
    },
  })
)
