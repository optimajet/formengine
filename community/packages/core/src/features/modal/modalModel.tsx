import {addOrUpdateFeatures} from '../define/utils/ComponentFeature'
import {
  cfDisableAdditionalProperties,
  cfDisableStyleProperties,
  cfDisableTooltipProperties
} from '../define/utils/integratedComponentFeatures'
import {Model} from '../define/utils/Model'
import {Modal} from './Modal'

const modalFeatures = addOrUpdateFeatures({},
  {name: cfDisableTooltipProperties, value: true},
  {name: cfDisableStyleProperties, value: true},
  {name: cfDisableAdditionalProperties, value: true},
)

const typeName = 'Modal'
export const modalModel = new Model(Modal, typeName, undefined, undefined,
  undefined, undefined, undefined, undefined, typeName, undefined, undefined,
  undefined, undefined, undefined, undefined, modalFeatures)
