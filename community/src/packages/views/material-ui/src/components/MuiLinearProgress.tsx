import {LinearProgress} from '@mui/material'
import {define, number, oneOfStrict} from '@react-form-builder/core'
import {color} from '../commonProperties'
import {feedbackCategory} from './categories'

export const muiLinearProgress = define(LinearProgress, 'MuiLinearProgress')
  .icon('ProgressLine')
  .category(feedbackCategory)
  .props({
    value: number,
    valueBuffer: number,
    variant: oneOfStrict('buffer', 'determinate', 'indeterminate', 'query'),
    color
  })
