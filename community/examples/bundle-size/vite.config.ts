import {copyFileSync, existsSync, rmSync} from 'fs'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'
import {defineConfig, type Plugin} from 'vite'
import {analyzer} from 'vite-bundle-analyzer'

// import { bundleStats } from 'rollup-plugin-bundle-stats'
// import bundlesize from "vite-plugin-bundlesize";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const input = process.env.APP_INPUT

if (!input) {
  console.error('Input point not specified')
  process.exit(1)
}

const createDevIndexPlugin = (htmlInput: string | undefined): Plugin => {
  const resolvedInput = htmlInput ?? 'index'

  return {
    name: 'dev-index-runtime-entry',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (!req.url) {
          next()
          return
        }

        if (req.url === '/' || req.url === '/index.html') {
          req.url = `/src/${resolvedInput}.html`
        }

        next()
      })
    },
  }
}

const createCopyIndexPlugin = (htmlInput: string): Plugin => {
  return {
    name: 'copy-index-html',
    apply: 'build',
    writeBundle(options, _bundle) {
      if (!options.dir) return

      // Copy the built HTML file (which Vite processes and outputs) to index.html
      const builtHtmlPath = join(options.dir, 'src', `${htmlInput}.html`)
      const indexHtmlPath = join(options.dir, 'index.html')
      const srcDirPath = join(options.dir, 'src')

      if (existsSync(builtHtmlPath)) {
        copyFileSync(builtHtmlPath, indexHtmlPath)
        // Remove the src folder after copying
        if (existsSync(srcDirPath)) {
          rmSync(srcDirPath, {recursive: true, force: true})
        }
      } else {
        // Fallback: copy from source if built file doesn't exist
        const sourcePath = join(__dirname, 'src', `${htmlInput}.html`)
        if (existsSync(sourcePath)) {
          copyFileSync(sourcePath, indexHtmlPath)
        }
      }
    },
  }
}

export default defineConfig({
  // with this setting only the production version of React will be included in the bundle
  define: {'process.env.NODE_ENV': '"production"'},
  plugins: [createDevIndexPlugin(input), createCopyIndexPlugin(input)],
  build: {
    emptyOutDir: true,
    sourcemap: true, // required for stat to work
    rollupOptions: {
      input: `/src/${input}.html`,

      // bundleStats
      // output: {
      // experimentalMinChunkSize: 50_000, // TODO check if really works
      //   assetFileNames: 'assets/[name].[hash][extname]',
      //   chunkFileNames: 'assets/[name].[hash].js',
      //   entryFileNames: 'assets/[name].[hash].js',
      //},

      plugins: [
        // bundlesize({
        //   allowFail: true
        // }),
        // bundleStats()
        analyzer({
          analyzerMode: 'json',
          fileName: `dist/vite-stat-${input}.json`,
          include: [/\.js$/, /assets\/.*\.js$/, /assets\/.*\.css$/],
        }),
      ],
    },
  },
})
