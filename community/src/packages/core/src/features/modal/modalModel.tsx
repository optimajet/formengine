import {Model} from '../define'
import {addOrUpdateFeatures} from '../define/utils/ComponentFeature'
import {
  cfDisableAdditionalProperties,
  cfDisableStyleProperties,
  cfDisableTooltipProperties
} from '../define/utils/integratedComponentFeatures'
import {Modal} from './Modal'

const modalFeatures = addOrUpdateFeatures({},
  {name: cfDisableTooltipProperties, value: true},
  {name: cfDisableStyleProperties, value: true},
  {name: cfDisableAdditionalProperties, value: true},
)

export const modalModel = new Model(Modal, 'Modal', undefined, undefined,
  undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  undefined, undefined, undefined, undefined, modalFeatures)
