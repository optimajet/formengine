import {createTheme, ScopedCssBaseline, ThemeProvider} from '@mui/material'
import type {ThemeOptions} from '@mui/material/styles/createTheme'
import type {FormViewerWrapper, Language} from '@react-form-builder/core'
import {useBuilderTheme} from '@react-form-builder/core'
import {useMemo} from 'react'
import {getLocale} from '../i18n/localizations'

type Theme = 'dark' | 'light'

const createMuiTheme = (theme: Theme, language?: Language) => {
  const options: ThemeOptions = {
    cssVariables: true,
    palette: {
      mode: theme,
    }
  }
  return createTheme(options, getLocale(language))
}

const containerStyle = {
  height: '100%',
  width: '100%'
}

/**
 * Provides the MUI theme.
 * @param props the FormViewerWrapper props.
 * @returns the React context provider.
 */
export const MuiViewerWrapper: FormViewerWrapper = (props) => {
  const theme = useBuilderTheme()
  const muiTheme = useMemo(() => createMuiTheme(theme, props.language), [props.language, theme])

  return <ThemeProvider theme={muiTheme}><ScopedCssBaseline style={containerStyle}>{props.children}</ScopedCssBaseline></ThemeProvider>
}
