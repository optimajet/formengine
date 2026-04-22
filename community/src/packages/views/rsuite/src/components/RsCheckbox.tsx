import {boolean, define, disabled, event, string} from '@react-form-builder/core'
import cx from 'clsx'
import type {CheckboxProps} from 'rsuite'
import {Checkbox} from 'rsuite'
import {readOnly} from '../commonProperties'
import {fieldsCategory} from './categories'
import styles from './RsCheckbox.module.css'

const RsCheckbox = ({className, ...props}: CheckboxProps<any>) => {
  return <Checkbox {...props} className={cx(styles.checkbox, className)}/>
}

export const rsCheckbox = define(RsCheckbox, 'RsCheckbox')
  .name('Checkbox')
  .category(fieldsCategory)
  .props({
    children: string.default('Checkbox'),
    checked: boolean
      .valued.uncontrolledValue(false),
    disabled: disabled.default(false),
    readOnly,
    indeterminate: boolean,
    inline: boolean.default(false),
    title: string,
    onChange: event,
  })
