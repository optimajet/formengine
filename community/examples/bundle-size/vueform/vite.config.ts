import vue from '@vitejs/plugin-vue'
import vueform from '@vueform/vueform/vite'
import {mergeConfig} from 'vite'

import bundleSizeBase from '../vite.config'

export default mergeConfig(bundleSizeBase, {
  plugins: [vue(), vueform()],
})
