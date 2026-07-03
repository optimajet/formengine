import {boolean, define, disabled, event, oneOf, string} from '@react-form-builder/core'
import cx from 'clsx'
import type {ToggleProps} from 'rsuite'
import {Toggle} from 'rsuite'
import {controlColor, readOnly} from '../commonProperties'
import {fieldsCategory} from './categories'
import styles from './RsToggle.module.css'

const RsToggle = ({className, ...props}: ToggleProps) => {
  return <Toggle {...props} className={cx(styles.toggle, className)}/>
}

export const rsToggle = define(RsToggle, 'RsToggle')
  .name('Toggle')
  .category(fieldsCategory)
  .props({
    children: string,
    checked: boolean.valued.uncontrolledValue(false),
    checkedChildren: string,
    unCheckedChildren: string,
    disabled: disabled.default(false),
    readOnly,
    size: oneOf('sm', 'md', 'lg')
      .labeled('Small', 'Medium', 'Large')
      .default('md')
      .withEditorProps({creatable: false}),
    color: controlColor,
    loading: boolean.default(false),
    onChange: event,
  })
