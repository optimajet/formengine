import type {ListProps} from '@mui/material'
import {List} from '@mui/material'
import {boolean, define, disabled, forwardRef, node, readOnly} from '@react-form-builder/core'
import type {ForwardedRef} from 'react'
import {sx} from '../commonProperties'
import {dataDisplayCategory} from './categories'
import type {DisabledProps} from './internal/DisabledProps'
import type {ReadOnlyProps} from './internal/ReadOnlyProps'

/**
 * The MuiList component properties.
 */
export interface MuiListProps extends ListProps, DisabledProps, ReadOnlyProps {
}

const MuiList = forwardRef((props: MuiListProps, ref: ForwardedRef<any>) => {
  const {disabled, readOnly, ...otherProps} = props
  return <List {...otherProps} ref={ref}/>
})

export const muiList = define(MuiList, 'MuiList')
  .category(dataDisplayCategory)
  .kind('container')
  .props({
    children: node,
    dense: boolean,
    disablePadding: boolean,
    sx,
    disabled: disabled,
    readOnly: readOnly
  })
