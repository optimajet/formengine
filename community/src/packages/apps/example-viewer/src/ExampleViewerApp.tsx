import type {ViewType} from '@react-form-builder/apps-common'
import {ThemePicker, usePersistentTheme, usePersistentView, ViewPicker, ViewProvider} from '@react-form-builder/apps-common'
import type {BuilderTheme} from '@react-form-builder/core'
import {BuilderThemeProvider} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {useMemo} from 'react'
import {MantineViewer} from './components/MantineViewer'
import {MuiViewer} from './components/MuiViewer'
import {RSuiteViewer} from './components/RSuiteViewer'
import '../public/style.css'
import logo from './images/viewer.svg?url'

const storageKey = 'react-form-viewer-view'
const defaultView: ViewType = 'rsuite'

const themeStorageKey = 'react-form-viewer-theme'
const defaultTheme: BuilderTheme = 'light'

const getViewer = (view: ViewType): ReactNode => {
  switch (view) {
    case 'rsuite':
      return <RSuiteViewer />
    case 'mui':
      return <MuiViewer />
    case 'mantine':
      return <MantineViewer />
    default:
      return `"view" not defined`
  }
}

/**
 * @returns the App element.
 */
export const ExampleViewerApp = () => {
  const [view, setView] = usePersistentView('react-form-viewer', {storageKey, defaultView})
  const [theme, setTheme] = usePersistentTheme({storageKey: themeStorageKey, defaultTheme})
  const providerValue = useMemo(() => ({view, setView}), [view, setView])
  const viewer = useMemo(() => getViewer(view), [view])

  return (
    <BuilderThemeProvider value={theme}>
      <ViewProvider value={providerValue}>
        <div className="navbar rs-theme-dark">
          <a href="https://formengine.io" target="_blank" className="logo-1" aria-label="home" rel="noreferrer">
            <img width="Auto" height="32px" src={logo} alt="" />
          </a>
          <ThemePicker theme={theme} onChange={setTheme} />
          <ViewPicker />
        </div>
        {viewer}
      </ViewProvider>
    </BuilderThemeProvider>
  )
}
