import type {Params} from 'zod/v4/core/api'
import {isNull, isUndefined} from '../../../utils/tools'

export const requiredMessage = 'Required'
export const errorMapForUndefined: Params<any, any> = {
  error: ({input}) => {
    if (isUndefined(input) || isNull(input)) return requiredMessage
  }
}
