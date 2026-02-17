import type {BuilderTheme} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import type {SelectPickerProps} from 'rsuite'
import {SelectPicker} from 'rsuite'
import 'rsuite/SelectPicker/styles/index.css'

type Labeled = {value: BuilderTheme; label: string; icon?: ReactNode}

const items: Labeled[] = [
  {value: 'light', label: 'Light'},
  {value: 'dark', label: 'Dark'},
]

interface ThemePickerProps extends Partial<SelectPickerProps> {
  theme: BuilderTheme
}

/**
 * Component for selecting the viewer theme.
 * @param props the ThemePicker props.
 * @returns the React element.
 */
export const ThemePicker = (props: ThemePickerProps) => {
  const {theme, onChange} = props
  return (
    <SelectPicker
      value={theme}
      data={items}
      onChange={onChange}
      size={'sm'}
      searchable={false}
      cleanable={false}
      className={'subtle-style'}
    />
  )
}
