import {Tooltip} from '@mui/material'
import {boolean, define, node, number, string} from '@react-form-builder/core'
import {placement} from '../commonProperties'
import {dataDisplayCategory} from './categories'

export const muiTooltip = define(Tooltip, 'MuiTooltip')
  .icon('Tooltip')
  .category(dataDisplayCategory)
  .kind('container')
  .props({
    arrow: boolean,
    children: node,
    disableFocusListener: boolean,
    disableInteractive: boolean,
    disableHoverListener: boolean,
    disableTouchListener: boolean,
    followCursor: boolean,
    enterDelay: number,
    leaveDelay: number,
    placement,
    title: string.required.default('Tooltip message...').dataBound,
  })
  .componentRole('tooltip')
