import cx from 'clsx'
import type {ComponentProps, ForwardedRef} from 'react'
import {forwardRef} from '../../utils/forwardRefShim'
import styles from './DefaultWrapper.module.css'

/**
 * The React component that wraps every component in a form.
 * @param props the React component properties.
 * @returns the React element.
 */
export const DefaultWrapper = forwardRef((props: ComponentProps<any>, ref: ForwardedRef<any>) => {
  const {className, children, ...otherProps} = props
  const cls = cx(styles.defaultWrapper, className)
  return <div className={cls} data-testid={'default-wrapper'} {...otherProps} ref={ref}>{children}</div>
})
