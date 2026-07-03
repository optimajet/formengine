import {containerStyles, define, disabled, forwardRef, node, readOnly} from '@react-form-builder/core'
import cx from 'clsx'
import type {ForwardedRef, ReactNode} from 'react'
import {structureCategory} from './categories'
import styles from './RsContainer.module.css'

const {flexDirection, gap} = containerStyles

/**
 * Props for the RsContainer component.
 */
export interface RsContainerProps {
  /**
   * Whether the container is disabled.
   */
  disabled?: boolean
  /**
   * Whether the container is read only.
   */
  readOnly?: boolean
  /**
   * Children elements of the container.
   */
  children?: ReactNode
  /**
   * CSS class name.
   */
  className?: string
}

/**
 * Container component with flex layout.
 * @param props the component props.
 * @returns the React element.
 */
const RsContainer = forwardRef((props: RsContainerProps, ref: ForwardedRef<any>) => {
  const {disabled, readOnly, className, ...otherProps} = props
  return <div {...otherProps} className={cx(styles.container, className)} ref={ref}/>
})

export const rsContainer = define(RsContainer, 'RsContainer')
  .name('Container')
  .category(structureCategory)
  .kind('container')
  .props({
    children: node,
    disabled: disabled,
    readOnly: readOnly,
  })
  .css({
    ...containerStyles,
    flexDirection: flexDirection.default('column'),
    gap: gap.default('10px')
  })
