import path from 'path'
import type {ModuleFormat} from 'rollup'
import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle'
import {fileURLToPath} from 'url'
import {defineConfig, mergeConfig} from 'vite'
import dts from 'vite-plugin-dts'

import base from '../../vite.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig((env) => mergeConfig(base(env), {
  plugins: [
    dts({rollupTypes: true, tsconfigPath: './bundle.tsconfig.json'})
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        'index-lite': path.resolve(__dirname, 'src/index-lite.ts')
      },
      formats: ['es'],
      fileName: (_format: ModuleFormat, entryName: string) => `${entryName}.js`
    },
    rollupOptions: {
      plugins: [excludeDependenciesFromBundle({dependencies: true, peerDependencies: true})]
    }
  },
}))
