import react from '@vitejs/plugin-react-swc'
import {playwright} from '@vitest/browser-playwright'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {defineConfig, PluginOption} from 'vite'
import {analyzer} from 'vite-bundle-analyzer'
import svgr from 'vite-plugin-svgr'
import {configDefaults} from 'vitest/config'
import {appVersionMetaPlugin} from './vite-plugin-app-version.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Absolute paths to the shared component test setup files.
 */
export const componentTestSetupFiles = [
  path.resolve(__dirname, 'tests/component/config/setup-act-environment.ts'),
  path.resolve(__dirname, 'tests/component/config/setup.ts'),
]

/**
 * Glob for component tests, relative to a tests/react-* package.
 */
export const componentTestGlob = '../component/tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'

const isCI = !!(process.env.CI || process.env.GITHUB_ACTIONS || process.env.EARTHLY_CI)

const plugins: PluginOption = [
  react(),
  svgr({
    include: '**/*.svg',
  }),
  appVersionMetaPlugin(__dirname),
]

if (process.env.VITE_BUNDLE_ANALYZER === 'true') {
  plugins.push(
    analyzer({
      analyzerMode: 'static',
      summary: true
    }),
  )
}

export default defineConfig(() => ({
  build: {
    cssMinify: 'lightningcss',
  },
  plugins,
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
    setupFiles: componentTestSetupFiles,
    coverage: {
      reporter: ['text', 'html'],
    },
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
    silent: isCI ? 'passed-only' : false,
    reporters: isCI ? ['dot', 'junit'] : ['default', 'junit'],
    outputFile: {
      junit: './reports/junit-report.xml',
    },
    onConsoleLog(log: string, type: 'stdout' | 'stderr'): boolean | void {
      if (!isCI && type === 'stderr') {
        // additionally, write to console.error to make the tests crash
        console.error(log)
      }
      return true
    },
    testTimeout: 60_000,
    browser: {
      provider: playwright(),
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
    }
    // reporters: ['verbose']
  }
}))
