import react from '@vitejs/plugin-react-swc'
import path from 'path'
import {fileURLToPath} from 'url'
import {defineConfig} from 'vite'
import {analyzer} from 'vite-bundle-analyzer'
import svgr from 'vite-plugin-svgr'
import {configDefaults} from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({command}) => ({
  plugins: [
    analyzer({
      analyzerMode: 'static',
      summary: true
    }),
    react({jsxImportSource: '@emotion/react'}),
    svgr({
      include: '**/*.svg',
    })
  ],
  define: {
    'process.env.WDYR': `"${process.env.WDYR ? '1' : ''}"`
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    allowedHosts: ['formengine.local']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    alias: [
      {
        find: /^monaco-editor$/,
        replacement:
          __dirname + '/node_modules/monaco-editor/esm/vs/editor/editor.api',
      },
    ],
    exclude: [
      ...configDefaults.exclude,
      'examples/**',
    ],
    onConsoleLog(log: string, type: 'stdout' | 'stderr'): boolean | void {
      if (type === 'stderr') {
        // additionally, write to console.error to make the tests crash
        console.error(log)
      }
      return true
    },
    testTimeout: 60_000,
    browser: {
      provider: 'playwright',
      enabled: false,
      name: 'chromium',
      instances: [{browser: 'chromium'}],
      screenshotFailures: true,
      screenshotDirectory: 'reports/screenshots',
      viewport: {
        width: 1440,
        height: 900,
      },
      providerOptions: {
        launch: {
          devtools: !!process.env.BROWSER_DEVTOOL
        }
      }
    },
    // reporters: ['verbose']
  }
}))
