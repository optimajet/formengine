import type {ReactNode} from 'react'
import {Model} from '../define/utils/Model'
import {useRepeaterProps} from './RepeaterPropsContext'

/**
 * The RepeaterItem component properties.
 */
interface RepeaterItemProps {
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
const typeName = 'RepeaterItem'

export const repeaterItemModel = new Model(RepeaterItem, typeName, undefined, undefined,
  undefined, undefined, undefined, undefined, typeName)
