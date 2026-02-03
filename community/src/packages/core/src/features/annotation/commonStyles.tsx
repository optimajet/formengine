import {cssSize} from './cssSizeAnnotation'
import {createAnnotation} from './utils/createAnnotation'

/**
 * The annotation builder for a component property containing a CSS color.
 */
const cssColor = createAnnotation('color').setup({calculable: false})

/**
 * The annotations for generic CSS properties of a component.
 */
export const commonStyles = {
  width: cssSize.setup({default: '100%'}),
  height: cssSize,
  marginTop: cssSize,
  marginInlineEnd: cssSize,
  marginBottom: cssSize,
  marginInlineStart: cssSize,
  color: cssColor,
  backgroundColor: cssColor,
}
