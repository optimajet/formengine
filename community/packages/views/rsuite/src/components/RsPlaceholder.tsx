import {boolean, define, number, oneOf, size} from '@react-form-builder/core'
import {Placeholder} from 'rsuite'
import {staticCategory} from './categories'

const iconStyle = {width: 24, height: 24}

const IconGrid = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="4" y1="8" x2="8" y2="8" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="4" y1="12" x2="10" y2="12" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="4" y1="16" x2="9" y2="16" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="13" y1="8" x2="20" y2="8" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="12" y1="12" x2="20" y2="12" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="14" y1="16" x2="20" y2="16" stroke="#9CA3AF" strokeWidth="1"/>
  </svg>
)

const IconParagraph = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="10" x2="20" y2="10" stroke="#9CA3AF" strokeWidth="1"/>
    <line x1="12" y1="14" x2="20" y2="14" stroke="#9CA3AF" strokeWidth="1"/>
    <circle cx="5" cy="12" r="4" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity="0.7"/>
  </svg>
)

const IconGraph = () => (
  <svg style={iconStyle} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="14" height="14" fill="#9CA3AF" fillOpacity="0.7"/>
  </svg>
)

export const rsPlaceholderGraph = define(Placeholder.Graph, 'RsPlaceholderGraph')
  .name('Placeholder graph')
  .category(staticCategory)
  .icon(IconGraph)
  .props({
    width: size.default('100%'),
    height: number.default(200),
    active: boolean,
  })

export const rsPlaceholderGrid = define(Placeholder.Grid, 'RsPlaceholderGrid')
  .name('Placeholder grid')
  .category(staticCategory)
  .icon(IconGrid)
  .props({
    rows: number.default(5),
    columns: number.default(5),
    rowHeight: number.default(10),
    rowSpacing: number.default(20),
    active: boolean,
  })

export const rsPlaceholderParagraph = define(Placeholder.Paragraph, 'RsPlaceholderParagraph')
  .name('Placeholder paragraph')
  .category(staticCategory)
  .icon(IconParagraph)
  .props({
    rows: number.default(2),
    rowHeight: number.default(10),
    rowSpacing: number.default(20),
    graph: oneOf('circle', 'square', 'image')
      .withEditorProps({creatable: false}),
    active: boolean,
  })
