import type {ReactNode} from 'react'
import {Model} from '../define/utils/Model'

interface FragmentProps {
  children: ReactNode
}

const Fragment = ({children}: FragmentProps) => <>{children}</>
const typeName = 'Fragment'

/**
 * Form viewer fragment metadata. **Internal use only.**
 */
export const fragmentModel = new Model(Fragment, typeName, undefined, undefined, undefined,
  undefined, undefined, undefined, typeName, 'container')
