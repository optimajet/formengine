import react from '@vitejs/plugin-react-swc'
import {mergeConfig} from 'vite'
import svgr from 'vite-plugin-svgr'

import bundleSizeBase from '../vite.config'

export default () =>
  mergeConfig(bundleSizeBase, {
    plugins: [
      react({jsxImportSource: '@emotion/react'}),
      svgr({
        include: '**/*.svg',
      }),
    ],
    resolve: {
      dedupe: ['react-is'], // MUI
      alias: {
        lodash: 'lodash-es',
      },
    },
  })
