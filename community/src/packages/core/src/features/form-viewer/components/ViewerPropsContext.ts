import {createNonNullableContext} from '../../../utils/createNonNullableContext'
import type {FormViewerProps} from '../types'

export const [
  /**
   * **Internal use only.**
   */
  useViewerProps,
  /**
   * **Internal use only.**
   */
  ViewerPropsProvider] = createNonNullableContext<Readonly<FormViewerProps>>('FormViewerPropsContext')
