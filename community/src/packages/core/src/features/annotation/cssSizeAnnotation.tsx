import {createAnnotation} from './utils/createAnnotation'

/**
 * The annotation builder for a component property containing a CSS dimension.
 */
export const cssSize = createAnnotation('size').setup({calculable: false})
