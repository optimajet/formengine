import type {ScreenProps} from '../../types'
import {disabled} from '../annotation/disabledAnnotation'
import {node} from '../annotation/nodeAnnotation'
import {readOnly} from '../annotation/readOnlyAnnotation'
import {toArray} from '../annotation/toArray'
import {modules} from '../define/constants'
import {Meta} from '../define/utils/Meta'
import {screenModel, screenStyleProperties} from '../ui/screenModel'

export const screenMeta = new Meta(
  screenModel.type,
  toArray<ScreenProps>({
    children: node,
    disabled: disabled,
    readOnly: readOnly,
  }),
  screenStyleProperties,
  [],
  modules,
)
