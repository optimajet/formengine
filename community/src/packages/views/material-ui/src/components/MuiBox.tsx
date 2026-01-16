import {Box} from '@mui/material'
import {define, node} from '@react-form-builder/core'
import {sx} from '../commonProperties'
import {layoutCategory} from './categories'

export const muiBox = define(Box, 'MuiBox')
  .icon('Container')
  .category(layoutCategory)
  .kind('container')
  .props({
    children: node,
    sx
  })
