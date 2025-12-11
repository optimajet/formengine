import {css, cx} from '@emotion/css'
import type {DetailedHTMLProps, HTMLAttributes} from 'react'
import {useMemo} from 'react'

const divClass = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 5px;
`

/**
 * The React component that wraps every component in a form.
 * @param props the React component properties.
 * @returns the React element.
 */
export const ViewerWrapper = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const {className, children, ...otherProps} = props
  const cls = useMemo(() => cx(divClass, className), [className])
  return <div className={cls} {...otherProps}>{children}</div>
}
