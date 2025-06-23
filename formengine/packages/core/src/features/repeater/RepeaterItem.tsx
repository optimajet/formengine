import type {ReactNode} from 'react'
import {Model} from '../define'
import {useRepeaterProps} from './RepeaterPropsContext'

/**
 * The RepeaterItem component properties.
 */
export interface RepeaterItemProps {
  /**
   * The React child node.
   */
  children: ReactNode
}

/**
 * The React component that displays a Repeater item.
 * @param props the React component properties.
 * @returns the React element.
 */
export const RepeaterItem = (props: RepeaterItemProps) => {
  const {className} = useRepeaterProps()
  return <div className={className}>{props.children}</div>
}
RepeaterItem.displayName = 'RepeaterItem'

export const repeaterItemModel = new Model(RepeaterItem, 'RepeaterItem')
