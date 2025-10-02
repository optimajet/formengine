import {boolean, define, event, node, oneOf, string} from '@react-form-builder/core'
import type {ComponentProps} from 'react'
import {textStyles} from '../commonProperties'
import type {TextProps} from '../commonTypes'
import {staticCategory} from './categories'

/**
 * Props for the RsLink component.
 */
export interface RsLinkProps extends ComponentProps<'a'>, TextProps {
  /**
   * The link text content.
   */
  text: string
  /**
   * The filename for download when download is enabled.
   */
  downloadFilename: string
  /**
   * The content type (text or custom).
   */
  content: string
}

/**
 * A link component that renders an anchor element with configurable content and behavior.
 * @param props the component props.
 * @param props.text the link text content.
 * @param props.download whether to download the linked resource.
 * @param props.downloadFilename the filename for download when download is enabled.
 * @param props.content the content type (text or custom).
 * @param props.children the custom content when content type is 'custom'.
 * @returns the React element.
 */
const RsLink = ({text, download, downloadFilename, content, children, ...props}: RsLinkProps) => (
  <a {...props} download={downloadFilename ?? download}>
    {content === 'text' ? text : children}
  </a>
)

export const rsLink = define(RsLink, 'RsLink')
  .name('Link')
  .category(staticCategory)
  .props({
    content: oneOf('text', 'custom').default('text').radio(),
    text: string.default('Link'),
    href: string,
    children: node.hinted('Component children'),
    target: oneOf('_self', '_blank', '_parent', '_top', '_unfencedTop').default('_blank')
      .withEditorProps({creatable: false}),
    download: boolean.default(false),
    downloadFilename: string,
    onClick: event,
  })
  .css({
    ...textStyles
  })
