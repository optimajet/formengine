import cx from 'clsx'
import type {LoaderProps} from 'rsuite'
import {Loader} from 'rsuite'
import styles from './SLoader.module.css'

/**
 * Styled loader.
 * @param props the component props.
 * @param props.className the CSS class name.
 * @returns the React element.
 */
export const SLoader = ({className, ...props}: LoaderProps) => {
  return <Loader {...props} className={cx(styles.loader, className)}/>
}
