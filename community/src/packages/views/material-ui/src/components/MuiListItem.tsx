import {ListItem} from '@mui/material'
import {boolean, define, node} from '@react-form-builder/core'
import {sx} from '../commonProperties'
import {dataDisplayCategory} from './categories'

export const muiListItem = define(ListItem, 'MuiListItem')
  .category(dataDisplayCategory)
  .kind('container')
  .props({
    children: node,
    dense: boolean,
    disableGutters: boolean,
    disablePadding: boolean,
    divider: boolean,
    sx
  })
