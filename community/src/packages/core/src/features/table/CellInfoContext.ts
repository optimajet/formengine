import {createNonNullableContext} from '../../utils/createNonNullableContext'
import type {CellInfo} from './CellInfo'

export const [
  ,
  CellInfoContextProvider,
  CellInfoContext,
] = createNonNullableContext<CellInfo>('CellInfoContext')
