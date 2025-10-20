import createCache from '@emotion/cache'
import {BiDi} from './bidi'

/**
 * The CSS style cache. **Internal use only.**
 */
export const emotionCache = {
  LTR: createCache({
    key: BiDi.LTR
  }),
  RTL: createCache({
    key: BiDi.RTL,
    prepend: true
  }),
}
