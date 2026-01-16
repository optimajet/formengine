import {Container} from '@mui/material'
import {boolean, define, node, oneOf, size} from '@react-form-builder/core'
import {sx} from '../commonProperties'
import {layoutCategory} from './categories'

export const muiContainer = define(Container, 'MuiContainer')
  .icon('Container')
  .category(layoutCategory)
  .kind('container')
  .props({
    children: node,
    disableGutters: boolean,
    fixed: boolean,
    maxWidth: oneOf('xs', 'sm', 'md', 'lg', 'xl'),
    sx
  })
  .css({
    gap: size.default('10px')
  })
