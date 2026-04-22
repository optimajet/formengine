import {useEffect, useState} from 'react'
import type {ViewType} from '../components/ViewContext'
import {defaultView} from '../components/ViewContext'

type UsePersistentViewOptions = {
  storageKey?: string
}

const allViewTypes: Record<ViewType, undefined> = {
  'rsuite-inject-css': undefined,
  'rsuite-import-css': undefined,
  mui: undefined,
  mantine: undefined,
}

const allViews = Object.keys(allViewTypes)

/**
 * Returns the localStorage key used for persisting the builder view.
 * @param appName the application name when no custom `storageKey` is set.
 * @param options optional storage configuration.
 * @returns the storage key string.
 */
export const getViewStorageKey = (appName = 'form-builder', options?: UsePersistentViewOptions): string => {
  return options?.storageKey ?? `${appName}-view-name`
}

/**
 * React hook that provides a persistent view state synced with localStorage.
 * When no value is stored (missing, empty, or whitespace-only), {@link defaultView} (Material UI) is used.
 * @param appName the name of the application for which the view is being persisted.
 * @param options optional storage configuration.
 * @returns a tuple containing the current view and a setter function
 * to update and persist the view.
 */
export const usePersistentView = (appName = 'form-builder', options?: UsePersistentViewOptions): [ViewType, (view: ViewType) => void] => {
  const storageKey = getViewStorageKey(appName, options)

  const [view, setViewState] = useState<ViewType>(() => {
    const raw = localStorage.getItem(storageKey)
    const value = raw?.trim()
    if (!value || allViews.indexOf(value) === -1) {
      return defaultView
    }
    return raw as ViewType
  })

  useEffect(() => localStorage.setItem(storageKey, view), [storageKey, view])

  return [view, setViewState]
}
