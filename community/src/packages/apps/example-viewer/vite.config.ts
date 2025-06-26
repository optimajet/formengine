import path from 'path'
import {fileURLToPath} from 'url'
import {defineConfig, mergeConfig} from 'vite'

import base from '../../../vite.config'
import packageJson from './package.json'

const peerDependencies = (packageJson as any)['peerDependencies'] || {}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig((env) => mergeConfig(base(env), {
  resolve: {
    alias: {
      lodash: 'lodash-es'
    }
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: Object.keys(peerDependencies),
    }
  },
}))
