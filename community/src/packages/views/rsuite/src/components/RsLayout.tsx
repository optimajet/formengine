import {boolean, define, node, string} from '@react-form-builder/core'
import {Content, Footer, Header, Sidebar} from 'rsuite'

export const rsHeader = define(Header, 'RsHeader')
  .name('Header')
  .props({
    children: node
  })

export const rsContent = define(Content, 'RsContent')
  .name('Content')
  .props({
    children: node
  })

export const rsFooter = define(Footer, 'RsFooter')
  .name('Footer')
  .props({
    children: node
  })

export const rsSidebar = define(Sidebar, 'RsSidebar')
  .name('Sidebar')
  .props({
    children: node,
    collapsible: boolean.hinted('Sidebar can be collapsed').default(false),
    width: string.hinted('Width')
  })
