import type {ListItemProps} from '@mui/material'
import {ListItem} from '@mui/material'
import {boolean, define, disabled, forwardRef, node, readOnly} from '@react-form-builder/core'
import type {ForwardedRef} from 'react'
import {sx} from '../commonProperties'
import {dataDisplayCategory} from './categories'
import type {DisabledProps} from './internal/DisabledProps'
import type {ReadOnlyProps} from './internal/ReadOnlyProps'

/**
 * The MuiListItem component properties.
 */
export interface MuiListItemProps extends ListItemProps, DisabledProps, ReadOnlyProps {
}

const MuiListItem = forwardRef((props: MuiListItemProps, ref: ForwardedRef<any>) => {
  const {disabled, readOnly, ...otherProps} = props
  return <ListItem {...otherProps} ref={ref}/>
})

export const muiListItem = define(MuiListItem, 'MuiListItem')
  .category(dataDisplayCategory)
  .kind('container')
  .props({
    children: node,
    dense: boolean,
    disableGutters: boolean,
    disablePadding: boolean,
    divider: boolean,
    disabled: disabled,
    readOnly: readOnly,
    sx
  })
