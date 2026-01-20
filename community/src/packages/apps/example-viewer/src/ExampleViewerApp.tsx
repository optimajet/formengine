import type {BuilderTheme} from '@react-form-builder/core'
import {BuilderThemeProvider} from '@react-form-builder/core'
import {useEffect, useMemo, useState} from 'react'
import type {ViewType} from './components/ViewContext'
import {ViewProvider} from './components/ViewContext'
import {ViewPicker} from './components/ViewPicker'
import {MuiViewer} from './components/MuiViewer'
import {RSuiteViewer} from './components/RSuiteViewer'
import {ThemePicker} from './components/ThemePicker'
import '../public/style.css'
import logo from './images/viewer.svg?url'

const storageKey = 'react-form-viewer-view'
const defaultView: ViewType = 'rsuite'

const themeStorageKey = 'react-form-viewer-theme'
const defaultTheme: BuilderTheme = 'light'

const usePersistentView = (): [ViewType, (view: ViewType) => void] => {
  const [view, setViewState] = useState<ViewType>(() => {
    return (localStorage.getItem(storageKey) ?? defaultView) as ViewType
  })

  useEffect(() => localStorage.setItem(storageKey, view), [view])

  return [view, setViewState]
}

const usePersistentTheme = () => {
  const [theme, setTheme] = useState<BuilderTheme>(() => {
    return (localStorage.getItem(themeStorageKey) ?? defaultTheme) as BuilderTheme
  })

  useEffect(() => localStorage.setItem(themeStorageKey, theme), [theme])

  return [theme, setTheme] as const
}

/**
 * @returns the App element.
 */
export const ExampleViewerApp = () => {
  const [view, setView] = usePersistentView()
  const [theme, setTheme] = usePersistentTheme()
  const providerValue = useMemo(() => ({view, setView}), [view, setView])

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
        {view === 'rsuite' ? <RSuiteViewer /> : <MuiViewer />}
      </ViewProvider>
    </BuilderThemeProvider>
  )
}
