import type {ForwardRefRenderFunction, PropsWithoutRef, Ref} from 'react'
import {forwardRef as reactForwardRef} from 'react'
import {reactMajor} from './reactVersion'

// Fixes https://github.com/facebook/react/issues/31613
// Breaking https://github.com/mui/mui-x/issues/15770#issuecomment-2523670430
// Source https://github.com/mui/mui-x/pull/15955

/**
 * Shim to be compatible with React 19.
 * @param render the forward ref render function.
 * @returns the React component.
 */
export const forwardRef = <T, P = {}>(
  render: ForwardRefRenderFunction<T, P & { ref: Ref<T> }>,
) => {
  if (reactMajor >= 19) {
    const Component = (props: any) => render(props, props.ref ?? null)
    return Component as React.ForwardRefExoticComponent<P>
  }
  return reactForwardRef(render as ForwardRefRenderFunction<T, PropsWithoutRef<P>>)
}
