import {useComponentData} from '@react-form-builder/core'
import {useMemo} from 'react'

/**
 * Hook that provides a unique ID for a form control label.
 * @returns a unique ID for a form control label.
 */
export const useLabelId = () => {
  const {id} = useComponentData()
  return useMemo(() => `${id}-label`, [id])
}
