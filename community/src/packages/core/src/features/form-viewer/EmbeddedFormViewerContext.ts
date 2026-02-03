import type {ComponentType} from 'react'
import {createNonNullableContext} from '../../utils/createNonNullableContext'
import type {FormViewerProps} from './types'

export const [
  /**
   * @returns the internal FormViewer component for displaying modal windows, templates, etc. **Internal use only.**
   */
  useEmbeddedFormViewer,
  /**
   * **Internal use only.**
   */
  EmbeddedFormViewerProvider] = createNonNullableContext<ComponentType<FormViewerProps>>('EmbeddedFormViewerContext')
