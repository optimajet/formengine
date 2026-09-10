import type {FormViewerWrapper} from '@react-form-builder/core'
import {useBuilderTheme} from '@react-form-builder/core'
import {useContext} from 'react'
import {CustomContext} from 'rsuite/esm/CustomProvider/CustomContext.js'
import CustomProvider from 'rsuite/esm/CustomProvider/CustomProvider.js'

const rsViewerContainerStyle = {
  height: '100%',
  width: '100%',
  backgroundColor: 'var(--rs-bg-card)'
}

/**
 * Wrapper that applies the RSuite theme from BuilderThemeProvider.
 * Prefer {@link RsViewWrapper} when you also need localization.
 * When nested under another CustomProvider, inherits locale and other parent settings.
 * @param props the FormViewerWrapper props.
 * @returns the wrapped components with the RSuite theme applied.
 */
export const RsThemeWrapper: FormViewerWrapper = (props) => {
  const theme = useBuilderTheme()
  const parent = useContext(CustomContext)
  return (
    <CustomProvider {...parent} theme={theme}>
      <div className="rsuite" style={rsViewerContainerStyle}>{props.children}</div>
    </CustomProvider>
  )
}
