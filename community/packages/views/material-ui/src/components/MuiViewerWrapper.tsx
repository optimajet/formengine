import {createTheme, ScopedCssBaseline, ThemeProvider} from '@mui/material'
import type {FormViewerWrapper} from '@react-form-builder/core'
import {useBuilderTheme} from '@react-form-builder/core'
import {createContext, useContext, useMemo} from 'react'
import {getLocale} from '../i18n/localizations'

const MuiScopedContext = createContext(false)
const useMuiScopedContext = () => useContext(MuiScopedContext)

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
  const muiTheme = useMemo(
    () => createTheme({cssVariables: true, palette: {mode: theme}}, getLocale(props.language)),
    [props.language, theme],
  )

  const alreadyScoped = useMuiScopedContext()
  const children = <MuiScopedContext.Provider value>{props.children}</MuiScopedContext.Provider>

  if (alreadyScoped) {
    return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <ScopedCssBaseline style={containerStyle}>{children}</ScopedCssBaseline>
    </ThemeProvider>
  )
}
