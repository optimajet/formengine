import type {FormViewerWrapper} from '@react-form-builder/core'
import {RsLocalizationWrapper} from './RsLocalizationWrapper'
import {RsThemeWrapper} from './RsThemeWrapper'

/**
 * Combined RSuite viewer wrapper that nests theme and localization providers.
 * Use this for FormBuilder, and for FormViewer when you need light/dark theming
 * (for example with BuilderThemeProvider). For locale and RTL only, use {@link RsLocalizationWrapper}.
 * @param props the FormViewerWrapper props.
 * @returns the wrapped components with theme and localization settings applied.
 */
export const RsViewWrapper: FormViewerWrapper = (props) => {
  return (
    <RsThemeWrapper {...props}>
      <RsLocalizationWrapper {...props}>
        {props.children}
      </RsLocalizationWrapper>
    </RsThemeWrapper>
  )
}
