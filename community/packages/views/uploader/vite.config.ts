import path from 'node:path'
import {fileURLToPath} from 'node:url'
import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle'
import {defineConfig, mergeConfig} from 'vite'
import dts from 'vite-plugin-dts'

import base from '../../../vite.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig((env) =>
  mergeConfig(base(env), {
    plugins: [dts({rollupTypes: true, tsconfigPath: './bundle.tsconfig.json'})],
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
