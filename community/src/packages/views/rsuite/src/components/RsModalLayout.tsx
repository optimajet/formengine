import {boolean, define, node} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {Modal} from 'rsuite'

const {Header, Title, Body, Footer} = Modal

interface RsModalLayoutProps {
  closeButton: boolean,
  headerTitle: ReactNode,
  body: ReactNode,
  footer: ReactNode,
}

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
  .props({
    closeButton: boolean.default(true),
    headerTitle: node,
    body: node,
    footer: node,
  })
