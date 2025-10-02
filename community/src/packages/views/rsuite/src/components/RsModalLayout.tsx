import {boolean, define, node} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {Modal} from 'rsuite'
import {modalCategory} from './categories'

const {Header, Title, Body, Footer} = Modal

/**
 * Props for the RsModalLayout component.
 */
export interface RsModalLayoutProps {
  /**
   * Whether to show the close button.
   */
  closeButton: boolean,
  /**
   * The title for the modal header.
   */
  headerTitle: ReactNode,
  /**
   * The content for the modal body.
   */
  body: ReactNode,
  /**
   * The content for the modal footer.
   */
  footer: ReactNode,
}

/**
 * Modal layout component with header, body and footer sections.
 * @param props the component props.
 * @returns the React element.
 */
const RsModalLayout = (props: RsModalLayoutProps) => {
  const {closeButton, headerTitle, body, footer, ...rest} = props
  return <div {...rest}>
    <Header closeButton={closeButton}>
      <Title>
        {headerTitle}
      </Title>
    </Header>
    <Body>
      {body}
    </Body>
    <Footer>
      {footer}
    </Footer>
  </div>
}

export const rsModalLayout = define(RsModalLayout, 'RsModalLayout')
  .name('Modal layout')
  .category(modalCategory)
  .props({
    closeButton: boolean.default(true),
    headerTitle: node,
    body: node,
    footer: node,
  })
