import react from '@vitejs/plugin-react-swc'
import {defineConfig} from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react({jsxImportSource: '@emotion/react'}),
    svgr({
      include: '**/*.svg',
    })
  ],
})
