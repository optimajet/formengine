import {css, cx} from '@emotion/css'
import type {DetailedHTMLProps, HTMLAttributes} from 'react'
import {useStore} from '../../../utils/contexts/StoreContext'

const divClass = css`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: auto;
  flex-direction: column;
  flex: 1;
  gap: 5px;
`
const rootPaddingClass = css`
  padding: 12px;
`

/**
 * The React component that wraps every component in a form.
 * @param props the React component properties.
 * @returns the React element.
 */
export const ViewerWrapper = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const {className, children, ...otherProps} = props
  const store = useStore()
  const root = !store.parentStore
  const cls = cx(divClass, className, root && rootPaddingClass)

  return <div className={cls} data-testid={'viewer-wrapper'}{...otherProps}>{children}</div>
}
