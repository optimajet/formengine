import type {LinkProps} from '@mui/material'
import {Link} from '@mui/material'
import {define, event, oneOfStrict, string, stringNode, useBuilderValue} from '@react-form-builder/core'
import {typography} from '../commonProperties'
import {navigationCategory} from './categories'

const defaultContent = 'Link'

const MuiLink = ({children, ...props}: LinkProps) => {
  const content = useBuilderValue(children, defaultContent)
  return <Link {...props}>{content}</Link>
}

export const muiLink = define(MuiLink, 'MuiLink')
  .icon('Link')
  .category(navigationCategory)
  .props({
    href: string,
    children: stringNode.setup({default: defaultContent}).dataBound,
    target: oneOfStrict('_self', '_blank', '_parent', '_top', '_unfencedTop').default('_blank'),
    onClick: event,
    ...typography
  })
