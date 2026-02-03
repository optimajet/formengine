import react from '@vitejs/plugin-react-swc'
import {mergeConfig} from 'vite'
import base from '../vite.config'

export default mergeConfig(base, {
  plugins: [react()],
  resolve: {
    dedupe: ['react-is'], // MUI
    alias: {
      lodash: 'lodash-es',
    },
  },
})
