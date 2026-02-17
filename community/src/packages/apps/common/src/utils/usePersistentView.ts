import {useEffect, useState} from 'react'
import type {ViewType} from '../components/ViewContext'
import {availableView, defaultView} from '../components/ViewContext'

type UsePersistentViewOptions = {
  storageKey?: string
  defaultView?: ViewType
}

/**
 * React hook that provides a persistent view state synced with localStorage.
 * @param appName the name of the application for which the view is being persisted.
 * @param options optional storage and default view configuration.
 * @returns a tuple containing the current view and a setter function
 * to update and persist the view.
 */
export const usePersistentView = (appName = 'form-builder', options?: UsePersistentViewOptions): [ViewType, (view: ViewType) => void] => {
  const defaultPersistentView = options?.defaultView ?? defaultView
  const storageKey = options?.storageKey ?? `${appName}-view-name`
  const [view, setViewState] = useState<ViewType>(() => {
    const item = (localStorage.getItem(storageKey) ?? defaultPersistentView) as ViewType
    return availableView.indexOf(item) < 0 ? defaultPersistentView : item
  })

  useEffect(() => localStorage.setItem(storageKey, view), [storageKey, view])

  return [view, setViewState]
}
