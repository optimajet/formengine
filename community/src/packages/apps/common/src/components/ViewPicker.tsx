import type {ChangeEvent, ComponentPropsWithoutRef} from 'react'
import {useCallback} from 'react'
import type {ViewType} from './ViewContext'
import {useView} from './ViewContext'
import styles from './ViewPicker.module.css'

type ViewPickerItem = {
  value: ViewType
  label: string
}

/**
 * Which built-in option set {@link ViewPicker} shows.
 */
export type ViewPickerPreset = 'full' | 'rsuite-single'

const VIEW_PICKER_ITEMS_FULL: ViewPickerItem[] = [
  {value: 'rsuite-inject-css', label: 'RSuite UI inject'},
  {value: 'rsuite-import-css', label: 'RSuite UI import'},
  {value: 'mui', label: 'Material UI'},
  {value: 'mantine', label: 'Mantine UI'},
]

const VIEW_PICKER_ITEMS_SINGLE_RSUITE: ViewPickerItem[] = [
  {value: 'rsuite-inject-css', label: 'RSuite UI'},
  {value: 'mui', label: 'Material UI'},
  {value: 'mantine', label: 'Mantine UI'},
]

/**
 * Resolves the option list for a preset.
 * @param preset which option set to use
 * @returns view picker rows
 */
function getViewPickerItemsForPreset(preset: ViewPickerPreset): ViewPickerItem[] {
  switch (preset) {
    case 'rsuite-single':
      return VIEW_PICKER_ITEMS_SINGLE_RSUITE
    case 'full':
    default:
      return VIEW_PICKER_ITEMS_FULL
  }
}

type ViewPickerProps = Omit<ComponentPropsWithoutRef<'select'>, 'value' | 'onChange' | 'children'> & {
  preset?: ViewPickerPreset
}

/**
 * Selects the viewer component library (native select, styled like ThemePicker).
 * Persists the choice to localStorage and reloads the page so stylesheet state resets cleanly.
 * @param props the component props
 * @param props.preset which option set to show (full vs single RSuite label)
 * @param props.className optional class name for the select element
 * @param props.'aria-label' optional accessible label for the select
 * @returns the React element
 */
export const ViewPicker = ({preset = 'full', className, 'aria-label': ariaLabel, ...rest}: ViewPickerProps) => {
  const items = getViewPickerItemsForPreset(preset)
  const {view, setView, viewStorageKey} = useView()
  const selectClass = [styles.select, className].filter(Boolean).join(' ')

  const allowed = new Set(items.map(i => i.value))
  const selectValue = allowed.has(view) ? view : items[0]?.value

  const handleViewChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextView = event.target.value as ViewType
      if (nextView === view || typeof window === 'undefined') {
        return
      }
      localStorage.setItem(viewStorageKey, nextView)
      setView(nextView)
    },
    [view, setView, viewStorageKey]
  )

  return (
    <div className={styles.root}>
      <select
        {...rest}
        aria-label={ariaLabel ?? 'Component library'}
        className={selectClass}
        value={selectValue}
        onChange={handleViewChange}
      >
        {items.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  )
}
