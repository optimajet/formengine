import {Typography} from '@mui/material'
import {define, string} from '@react-form-builder/core'
import {typography} from '../commonProperties'
import {dataDisplayCategory} from './categories'

export const muiTypography = define(Typography, 'MuiTypography')
  .icon('StaticContent')
  .category(dataDisplayCategory)
  .props({
    children: string.default('Typography').dataBound,
    ...typography
  })
