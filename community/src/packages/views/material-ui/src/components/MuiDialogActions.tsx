import {DialogActions} from '@mui/material'
import {boolean, define, node} from '@react-form-builder/core'
import {sx} from '../commonProperties'
import {layoutCategory} from './categories'

export const muiDialogActions = define(DialogActions, 'MuiDialogActions')
  .icon('Button')
  .category(layoutCategory)
  .props({
    children: node,
    disableSpacing: boolean,
    sx
  })
  .hideFromComponentPalette()
