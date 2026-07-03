import {CircularProgress} from '@mui/material'
import {boolean, define, number, oneOfStrict} from '@react-form-builder/core'
import {color} from '../commonProperties'
import {feedbackCategory} from './categories'

export const muiCircularProgress = define(CircularProgress, 'MuiCircularProgress')
  .icon('ProgressCircle')
  .category(feedbackCategory)
  .props({
    value: number,
    thickness: number,
    variant: oneOfStrict('determinate', 'indeterminate'),
    color,
    disableShrink: boolean
  })
