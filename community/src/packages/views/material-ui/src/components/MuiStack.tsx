import {Stack} from '@mui/material'
import {boolean, define, node, oneOf, oneOfStrict, string} from '@react-form-builder/core'
import {sx} from '../commonProperties'
import {layoutCategory} from './categories'

export const muiStack = define(Stack, 'MuiStack')
  .icon('Container')
  .category(layoutCategory)
  .kind('container')
  .props({
    children: node,
    sx,
    direction: oneOf('row', 'row-reverse', 'column', 'column-reverse'),
    spacing: string,
    justifyContent: oneOfStrict(
      'flex-start',
      'center',
      'flex-end',
      'space-between',
      'space-around',
      'space-evenly',
    ),
    alignItems: oneOfStrict(
      'flex-start',
      'center',
      'flex-end',
      'stretch',
      'baseline',
    ),
    flexWrap: oneOfStrict('nowrap', 'wrap', 'wrap-reverse'),
    useFlexGap: boolean.default(true),
  })
