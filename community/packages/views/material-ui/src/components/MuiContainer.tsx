import type {ContainerProps} from '@mui/material'
import {Container} from '@mui/material'
import {boolean, define, disabled, forwardRef, node, oneOf, readOnly, size} from '@react-form-builder/core'
import type {ForwardedRef} from 'react'
import {sx} from '../commonProperties'
import {layoutCategory} from './categories'
import type {DisabledProps} from './internal/DisabledProps'
import type {ReadOnlyProps} from './internal/ReadOnlyProps'

/**
 * The MuiContainer component properties.
 */
export interface MuiContainerProps extends ContainerProps, DisabledProps, ReadOnlyProps {
}

/**
 * Container component with flex layout.
 * @param props the component props.
 * @returns the React element.
 */
const MuiContainer = forwardRef((props: MuiContainerProps, ref: ForwardedRef<any>) => {
  const {disabled, readOnly, ...otherProps} = props
  return <Container {...otherProps} ref={ref}/>
})

export const muiContainer = define(MuiContainer, 'MuiContainer')
  .icon('Container')
  .category(layoutCategory)
  .kind('container')
  .props({
    children: node,
    readOnly: readOnly,
    disabled: disabled,
    disableGutters: boolean,
    fixed: boolean,
    maxWidth: oneOf('xs', 'sm', 'md', 'lg', 'xl'),
    sx
  })
  .css({
    gap: size.default('10px')
  })
