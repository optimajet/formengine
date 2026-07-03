import path from 'node:path'
import {fileURLToPath} from 'node:url'
import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle'
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
      cssFileName: 'styles',
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: ({name}: { name: string }) => {
          // Keep entry points as before for backward compatibility
          if (name === 'index' || name === 'index-lite') {
            return `${name}.js`
          }
          // For other modules, preserve directory structure
          return `[name].js`
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: ({names}: { names: string[] }) => {
          if (names.length === 1 && names[0] === 'styles.css') {
            return 'assets/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        manualChunks: undefined, // Let Rollup decide chunks
      },
      plugins: [excludeDependenciesFromBundle({dependencies: true, peerDependencies: true})]
    }
  },
}))
