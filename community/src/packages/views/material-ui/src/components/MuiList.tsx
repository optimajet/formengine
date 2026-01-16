import {List} from '@mui/material'
import {boolean, define, node} from '@react-form-builder/core'
import {sx} from '../commonProperties'
import {dataDisplayCategory} from './categories'

export const muiList = define(List, 'MuiList')
  .category(dataDisplayCategory)
  .kind('container')
  .props({
    children: node,
    dense: boolean,
    disablePadding: boolean,
    sx
  })
