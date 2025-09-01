import type {ScreenProps} from '../../types'
import {disabled, node, readOnly} from '../annotation'
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
