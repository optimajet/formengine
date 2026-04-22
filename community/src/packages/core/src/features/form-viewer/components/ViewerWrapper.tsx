import cx from 'clsx'
import type {DetailedHTMLProps, HTMLAttributes} from 'react'
import {useStore} from '../../../utils/contexts/StoreContext'
import styles from './ViewerWrapper.module.css'

/**
 * The React component that wraps every component in a form.
 * @param props the React component properties.
 * @returns the React element.
 */
export const ViewerWrapper = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const {className, children, ...otherProps} = props
  const store = useStore()
  const root = !store.parentStore
  const cls = cx(styles.viewerWrapper, className, root && styles.rootPadding)

  return <div className={cls} data-testid={'viewer-wrapper'}{...otherProps}>{children}</div>
}
