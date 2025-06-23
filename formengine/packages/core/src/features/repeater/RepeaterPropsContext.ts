import {createNonNullableContext} from '../../utils/createNonNullableContext'
import type {RepeaterProps} from './RepeaterProps'

export const [
  /**
   * **Internal use only.**
   */
  useRepeaterProps,
  /**
   * **Internal use only.**
   */
  RepeaterPropsProvider] = createNonNullableContext<RepeaterProps>('RepeaterPropsContext')
