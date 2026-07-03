import {useComponentData} from './contexts/ComponentDataContext'

/**
 * @returns a field validation error message if the field data is not valid.
 */
export const useErrorMessage = () => {
  const componentData = useComponentData()
  return componentData.field?.error
}
