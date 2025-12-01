import path from 'path'
import type {ModuleFormat} from 'rollup'
// @ts-ignore
import {fileURLToPath} from 'url'
import type {LibraryFormats} from 'vite'
import {defineConfig} from 'vite'
import cp from 'vite-plugin-cp'

import base from '../../vite.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(() => ({
  ...base,
  // with this setting only the production version of React will be included in the bundle
  define: {'process.env.NODE_ENV': '"production"'},
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['umd', 'iife'] satisfies LibraryFormats[],
      fileName: (format: ModuleFormat) => `index.${format}.js`,
      name: 'FormEngineViewerBundle',
    },
    rollupOptions: {
      plugins: [
        cp({
          targets: [
            {
              src: '../views/rsuite/public/css/*.*',
              dest: 'dist',
            },
          ],
        }),
      ],
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react-is'],
  },
}))
