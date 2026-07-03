import {DialogContentText} from '@mui/material'
import {define, string} from '@react-form-builder/core'
import {sx, typography} from '../commonProperties'
import {dataDisplayCategory} from './categories'

export const muiDialogContentText = define(DialogContentText, 'MuiDialogContentText')
  .icon('StaticContent')
  .category(dataDisplayCategory)
  .props({
    children: string.default('Dialog content text'),
    sx,
    ...typography
  })
  .hideFromComponentPalette()
