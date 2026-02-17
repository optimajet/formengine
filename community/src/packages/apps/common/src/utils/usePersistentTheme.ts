import type {BuilderTheme} from '@react-form-builder/core'
import {useEffect, useState} from 'react'

type UsePersistentThemeOptions = {
  storageKey?: string
  defaultTheme?: BuilderTheme
}

/**
 * React hook that provides a persistent theme state synced with localStorage.
 * @param options configuration for the storage key and default theme.
 * @returns a tuple containing the current theme and a setter function.
 */
export const usePersistentTheme = (options?: UsePersistentThemeOptions) => {
  const storageKey = options?.storageKey ?? 'form-builder-theme'
  const defaultTheme = options?.defaultTheme ?? 'light'
  const [theme, setTheme] = useState<BuilderTheme>(() => {
    return (localStorage.getItem(storageKey) ?? defaultTheme) as BuilderTheme
  })

  useEffect(() => localStorage.setItem(storageKey, theme), [storageKey, theme])

  return [theme, setTheme] as const
}
