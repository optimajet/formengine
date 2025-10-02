import {commonStyles, containerStyles, getDefaultCss} from '../annotation'
import {toStyleProperties} from '../annotation/toStyleProperties'
import {Model} from '../define'
import {addOrUpdateFeatures} from '../define/utils/ComponentFeature'
import {cfDisableComponentRemove, cfHideFromComponentPalette} from '../define/utils/integratedComponentFeatures'
import {DefaultWrapper} from './DefaultWrapper'

const {height} = commonStyles
const {flexDirection, gap} = containerStyles
export const screenStyleProperties = toStyleProperties({
  ...containerStyles,
  ...commonStyles,
  height: height.setup({default: '100%'}),
  flexDirection: flexDirection.default('column'),
  gap: gap.default('10px')
})

const defaultCss = getDefaultCss(screenStyleProperties)

const screenFeatures = addOrUpdateFeatures({},
  {name: cfHideFromComponentPalette, value: true},
  {name: cfDisableComponentRemove, value: true}
)

/**
 * Form viewer screen metadata. **Internal use only.**
 */
export const screenModel = new Model(DefaultWrapper, undefined, undefined,
  undefined, undefined, undefined, defaultCss, undefined, undefined, 'container',
  'readOnly', undefined, undefined, 'disabled', undefined, screenFeatures)
