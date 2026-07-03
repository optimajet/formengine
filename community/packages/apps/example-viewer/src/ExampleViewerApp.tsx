import type {ViewType} from '@react-form-builder/apps-common'
import {
  getViewStorageKey,
  ThemePicker,
  usePersistentTheme,
  usePersistentView,
  ViewPicker,
  ViewProvider,
} from '@react-form-builder/apps-common'
import type {BuilderTheme} from '@react-form-builder/core'
import {BuilderThemeProvider} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {lazy, Suspense, useEffect, useMemo} from 'react'
import '../public/style.css'
import logo from './images/viewer.svg?url'

const LazyRSuiteViewer = lazy(() => import('./components/RSuiteViewer').then(m => ({default: m.RSuiteViewer})))
const LazyRsuiteViewerImportCss = lazy(() => import('./components/RsuiteViewerImportCss').then(m => ({default: m.RsuiteViewerImportCss})))
const LazyMuiViewer = lazy(() => import('./components/MuiViewer').then(m => ({default: m.MuiViewer})))
const LazyMantineViewer = lazy(() => import('./components/MantineViewer').then(m => ({default: m.MantineViewer})))

const storageKey = 'react-form-viewer-view'

const themeStorageKey = 'react-form-viewer-theme'
const defaultTheme: BuilderTheme = 'light'

const getViewer = (view: ViewType): ReactNode => {
  switch (view) {
    case 'rsuite-inject-css':
      return <LazyRSuiteViewer />
    case 'rsuite-import-css':
      return <LazyRsuiteViewerImportCss />
    case 'mui':
      return <LazyMuiViewer />
    case 'mantine':
      return <LazyMantineViewer />
    default:
      return `${view} not defined`
  }
}

const viewerSuspenseFallback = (
  <div role="status" aria-live="polite">
    Loading viewer…
  </div>
)

/**
 * @returns the App element.
 */
export const ExampleViewerApp = () => {
  const [view, setView] = usePersistentView('react-form-viewer', {storageKey})
  const [theme, setTheme] = usePersistentTheme({storageKey: themeStorageKey, defaultTheme})
  const providerValue = useMemo(
    () => ({
      view,
      setView,
      viewStorageKey: getViewStorageKey('react-form-viewer', {storageKey}),
    }),
    [view, setView]
  )
  const viewer = useMemo(() => getViewer(view), [view])

  useEffect(() => {
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light'
  }, [theme])

  return (
    <BuilderThemeProvider value={theme}>
      <ViewProvider value={providerValue}>
        <div className="navbar">
          <a href="https://formengine.io" target="_blank" className="logo-1" aria-label="home" rel="noreferrer">
            <img width="Auto" height="32px" src={logo} alt="" />
          </a>
          <ThemePicker theme={theme} onChange={setTheme} />
          <ViewPicker />
        </div>
        <Suspense fallback={viewerSuspenseFallback}>{viewer}</Suspense>
      </ViewProvider>
    </BuilderThemeProvider>
  )
}
