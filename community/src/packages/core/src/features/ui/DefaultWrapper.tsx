import {css, cx} from '@emotion/css'
import type {ComponentProps, ForwardedRef} from 'react'
import {useMemo} from 'react'
import {forwardRef} from '../../utils/forwardRefShim'

const defaultWrapperClass = css`
  display: flex;
  flex-direction: column;
`

/**
 * The React component that wraps every component in a form.
 * @param props the React component properties.
 * @returns the React element.
 */
export const DefaultWrapper = forwardRef((props: ComponentProps<any>, ref: ForwardedRef<any>) => {
  const {className, children, ...otherProps} = props
  const cls = useMemo(() => cx(defaultWrapperClass, className), [className])
  return <div className={cls} {...otherProps} ref={ref}>{children}</div>
})
DefaultWrapper.displayName = 'Screen'
