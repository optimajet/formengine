import {namedObserver, useAriaAttributes, useComponentData} from '@react-form-builder/core'
import cx from 'clsx'
import type {ComponentProps} from 'react'
import {cloneElement} from 'react'
import styles from './Labeled.module.css'

interface LabeledProps extends ComponentProps<any> {
  label?: string
  /**
   * If true, ARIA attributes will be passed automatically to children.
   */
  passAriaToChildren: boolean
}

/**
 * The React component that adds a label to a child component.
 * @param props the React component properties.
 * @param props.label the component label.
 * @param props.children the children component.
 * @param props.passAriaToChildren if true, ARIA attributes will be passed automatically to children.
 * @param props.className the CSS class name.
 * @returns the React element.
 */
const RawLabeled = ({label, children, passAriaToChildren, className, ...props}: LabeledProps) => {
  const {id} = useComponentData()
  const aria = useAriaAttributes({labeled: !!label})

  return (
    <div {...props} role="group" className={cx(styles.container, className)}>
      {label && <label id={aria['aria-labelledby']} htmlFor={id} className={styles.label}>{label}</label>}
      {passAriaToChildren ? cloneElement(children, {id, ...aria}) : children}
    </div>
  )
}

export const Labeled = namedObserver('Labeled', RawLabeled)
