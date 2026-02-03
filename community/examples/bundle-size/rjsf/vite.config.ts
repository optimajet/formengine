import {mergeConfig} from 'vite'

import bundleSizeBase from '../vite.config'

export default () =>
  mergeConfig(bundleSizeBase, {
    resolve: {
      dedupe: [
        'react-is', // MUI
        // 'ajv'
      ],
    },
  })
