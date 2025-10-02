import {array, boolean, define, event, fn, string, toLabeledValues} from '@react-form-builder/core'
import type {CSSProperties} from 'react'
import type {AutoCompleteProps} from 'rsuite'
import {AutoComplete} from 'rsuite'
import {inputProps} from '../commonProperties'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'

const AutoCompleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
                                    viewBox="0 0 24 24">
  <path stroke="#9ca3af" strokeWidth="2"
        d="M16.94 4H7.2c-1.12 0-1.68 0-2.1.22a2 2 0 0 0-.88.87C4 5.52 4 6.08 4 7.2v9.6c0 1.12 0 1.68.22 2.1.19.38.5.7.87.88.43.22.99.22 2.1.22h9.61c1.12 0 1.68 0 2.1-.22a2 2 0 0 0 .88-.87c.22-.43.22-.99.22-2.1v-6.15"/>
  <path stroke="#9ca3af" strokeWidth="2"
        d="M9.81 12.33h.01m.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm4.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
</svg>

/**
 * The properties of the RsAutoComplete component.
 */
export interface RsAutoCompleteProps extends AutoCompleteProps {
  /**
   * The component label.
   */
  label?: string
  /**
   * The component class name.
   */
  className?: string
  /**
   * The component styles.
   */
  style?: CSSProperties
  /**
   * Called after the value has been changed.
   * @param value the value.
   */
  onChange?: (value: string) => void
}

const RsAutoComplete = ({label, style, className, ...props}: RsAutoCompleteProps) => {
  return <Labeled label={label} style={style} className={className} passAriaToChildren={true}>
    <AutoComplete {...props} />
  </Labeled>
}

const filterByFnDescriptionBegin = `/**
 * @param {string} value
 * @param {ItemDataType} item
 * @return {boolean}
 */
function filterBy(value, item) {`

export const rsAutoComplete = define(RsAutoComplete, 'RsAutoComplete')
  .name('AutoComplete')
  .category(fieldsCategory)
  .icon(AutoCompleteIcon)
  .props({
    ...inputProps,
    label: string.default('Input'),
    data: array.default(toLabeledValues(['Item1', 'Item2', 'Item3'])),
    defaultValue: string,
    filterBy: fn(filterByFnDescriptionBegin),
    menuClassName: string,
    onClose: event,
    onEnter: event,
    onEntering: event,
    onExit: event,
    onExited: event,
    onExiting: event,
    onSelect: event,
    selectOnEnter: boolean.default(true),
    value: string.valued.uncontrolledValue(''),
  })
