import {css, cx} from '@emotion/css'
import type {DetailedHTMLProps, HTMLAttributes} from 'react'
import {useMemo} from 'react'

const defaultWrapperClass = css`
  display: flex;
`

/**
 * The React component that wraps every component in a form.
 * @param props the React component properties.
 * @returns the React element.
 */
export const DefaultWrapper = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const {className, children, ...otherProps} = props
  const cls = useMemo(() => cx(defaultWrapperClass, className), [className])
  return <div className={cls} {...otherProps}>{children}</div>
}
DefaultWrapper.displayName = 'Screen'
