import {useComponentData} from '@react-form-builder/core'
import {useMemo} from 'react'

/**
 * @returns the required attribute.
 */
export const useRequired = () => {
  const {store} = useComponentData()

  const item = store.schema?.validations
    ?.find(v => v.key === 'required')

  return useMemo(() => !!item, [item])
}
