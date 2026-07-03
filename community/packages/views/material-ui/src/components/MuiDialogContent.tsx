import {DialogContent} from '@mui/material'
import {boolean, define, node} from '@react-form-builder/core'
import {sx} from '../commonProperties'
import {dataDisplayCategory} from './categories'

export const muiDialogContent = define(DialogContent, 'MuiDialogContent')
  .icon('Container')
  .category(dataDisplayCategory)
  .props({
    children: node,
    dividers: boolean,
    sx
  })
  .hideFromComponentPalette()
