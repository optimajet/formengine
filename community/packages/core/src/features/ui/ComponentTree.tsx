import {createElement} from 'react'
import type {ComponentTreeProps} from '../../ComponentTreeProps'
import {ComponentDataProvider} from '../../utils/contexts/ComponentDataContext'
import {ComponentViewer} from './ComponentViewer'

/**
 * The React component that displays an array of ComponentData. **Internal use only.**
 * @param props the React component properties.
 * @param props.data the array of child elements of the tree.
 * @param props.componentDataViewer the component displaying an item.
 * @returns the React element.
 */
export const ComponentTree = ({data, componentDataViewer}: ComponentTreeProps) => {
  const children = data.map(cd => <ComponentDataProvider key={cd.id} value={cd}>
    {createElement(componentDataViewer ?? ComponentViewer)}
  </ComponentDataProvider>)

  return <>{children}</>
}
