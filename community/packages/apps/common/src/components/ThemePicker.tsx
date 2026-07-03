import type {BuilderTheme} from '@react-form-builder/core'
import type {ComponentPropsWithoutRef} from 'react'
import {useCallback} from 'react'

import styles from './ThemePicker.module.css'

type Labeled = {value: BuilderTheme; label: string}

const items: Labeled[] = [
  {value: 'light', label: 'Light'},
  {value: 'dark', label: 'Dark'},
]

type ThemePickerProps = {
  theme: BuilderTheme
  onChange: (theme: BuilderTheme) => void
} & Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'children'>

type ThemePickerSegmentProps = {
  item: Labeled
  checked: boolean
  onSelect: (theme: BuilderTheme) => void
}

const ThemePickerSegment = ({item, checked, onSelect}: ThemePickerSegmentProps) => {
  const onClick = useCallback(() => {
    onSelect(item.value)
  }, [item.value, onSelect])

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      className={styles.theme_picker__btn}
      tabIndex={checked ? 0 : -1}
      onClick={onClick}
    >
      {item.label}
    </button>
  )
}

/**
 * Theme toggle as a segmented control (no native select — consistent across browsers).
 * Uses lightweight native elements and scoped CSS only.
 * @param props the ThemePicker props.
 * @param props.theme the active builder theme.
 * @param props.onChange called when the user selects a theme.
 * @returns the React element.
 */
export const ThemePicker = ({theme, onChange, ...rest}: ThemePickerProps) => (
  <div {...rest} id={'theme-picker'} className={styles.theme_picker} role="radiogroup" aria-label={'Theme'}>
    {items.map(item => (
      <ThemePickerSegment key={item.value} item={item} checked={theme === item.value} onSelect={onChange} />
    ))}
  </div>
)
