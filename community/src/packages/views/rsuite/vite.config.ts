import path from 'path'
// @ts-ignore
import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle'
import {fileURLToPath} from 'url'
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

import base from '../../../vite.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({command}) => ({
  ...base,
  plugins: [
    dts({rollupTypes: true, tsconfigPath: './bundle.tsconfig.json'})
  ],
  build: {
    sourcemap: true,
    lib: {
      //entry: [path.resolve(__dirname, 'src/metaView.ts'), path.resolve(__dirname, 'src/modelView.ts')],
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      plugins: [excludeDependenciesFromBundle({dependencies: true, peerDependencies: true})],
    }
  },
}))
