import type {ReactNode} from 'react'
import {Model} from '../define'

interface FragmentProps {
  children: ReactNode
}

const Fragment = ({children}: FragmentProps) => <>{children}</>
Fragment.displayName = 'Fragment'

/**
 * Form viewer fragment metadata. **Internal use only.**
 */
export const fragmentModel = new Model(Fragment, 'Fragment', undefined, undefined, undefined,
  undefined, undefined, undefined, undefined, 'container')
