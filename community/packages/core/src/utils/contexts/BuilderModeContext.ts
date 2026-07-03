import {createNonNullableContext} from '../createNonNullableContext'
import type {BuilderMode} from './BuilderMode'

export const [
  /**
   * @returns the {@link BuilderMode} builder mode value.
   */
  useBuilderMode,
  /**
   * The BuilderMode context provider.
   */
  BuilderModeProvider
] = createNonNullableContext<BuilderMode>('BuilderModeContext', 'viewer')
