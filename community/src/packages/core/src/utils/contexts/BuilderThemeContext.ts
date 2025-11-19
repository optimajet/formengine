import {createNonNullableContext} from '../createNonNullableContext'
import type {BuilderTheme} from './BuilderTheme'

export const [
  /**
   * @returns the current {@link BuilderTheme} value.
   */
  useBuilderTheme,
  /**
   * Context provider for the {@link useBuilderTheme} hook.
   */
  BuilderThemeProvider
] = createNonNullableContext<BuilderTheme>('BuilderThemeContext', 'light')
