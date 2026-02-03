import {DialogTitle} from '@mui/material'
import {define, stringNode} from '@react-form-builder/core'
import {sx, typography} from '../commonProperties'
import {dataDisplayCategory} from './categories'

export const muiDialogTitle = define(DialogTitle, 'MuiDialogTitle')
  .icon('StaticContent')
  .category(dataDisplayCategory)
  .props({
    children: stringNode.setup({default: 'Dialog title'}),
    ...typography,
    sx
  })
  .hideFromComponentPalette()
