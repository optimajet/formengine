import type {BuilderTheme} from '@react-form-builder/core'
import {useEffect, useState} from 'react'

type UsePersistentThemeOptions = {
  storageKey?: string
  defaultTheme?: BuilderTheme
}

const parseStoredTheme = (raw: string | null, fallback: BuilderTheme): BuilderTheme => {
  const value = raw?.trim()
  if (value === 'light' || value === 'dark') {
    return value
  }
  return fallback
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
    return parseStoredTheme(localStorage.getItem(storageKey), defaultTheme)
  })

  useEffect(() => localStorage.setItem(storageKey, theme), [storageKey, theme])

  return [theme, setTheme] as const
}
