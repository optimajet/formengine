import vue from '@vitejs/plugin-vue'
import vueform from '@vueform/vueform/vite'
import {fileURLToPath, URL} from 'node:url'
import {mergeConfig} from 'vite'

import bundleSizeBase from '../vite.config'

export default mergeConfig(bundleSizeBase, {
  plugins: [vue(), vueform()],
  resolve: {
    alias: {
      // VueForm imports default from this path, but current locutus exports it as a named export.
      'locutus/php/datetime/strtotime': fileURLToPath(new URL('./src/shims/locutus-strtotime.ts', import.meta.url)),
    },
  },
})
