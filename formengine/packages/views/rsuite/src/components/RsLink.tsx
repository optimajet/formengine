import {boolean, define, event, node, oneOf, string} from '@react-form-builder/core'
import type {ComponentProps} from 'react'
import {textStyles} from '../commonProperties'
import type {TextProps} from '../commonTypes'

interface RsLinkProps extends ComponentProps<'a'>, TextProps {
  text: string
  downloadFilename: string
  content: string
}

const RsLink = ({text, download, downloadFilename, content, children, ...props}: RsLinkProps) => (
  <a {...props} download={downloadFilename ?? download}>
    {content === 'text' ? text : children}
  </a>
)

export const rsLink = define(RsLink, 'RsLink')
  .name('Link')
  .props({
    content: oneOf('text', 'custom').default('text').radio(),
    text: string.default('Link'),
    href: string,
    children: node.hinted('Component children'),
    target: oneOf('_self', '_blank', '_parent', '_top', '_unfencedTop').default('_blank'),
    download: boolean.default(false),
    downloadFilename: string,
    onClick: event,
  })
  .css({
    ...textStyles
  })
