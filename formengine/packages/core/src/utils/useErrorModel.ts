import {useMemo} from 'react'
import {Model} from '../features/define'
import {useViewerProps} from '../features/form-viewer/components/ViewerPropsContext'
import type {ErrorWrapperProps} from '../features/validation/components/DefaultErrorMessage'
import {errorMessageModel} from '../features/validation/components/DefaultErrorMessage'
import {useStore} from './contexts/StoreContext'

/**
 * @returns the model of React component used to display the error.
 */
export const useErrorModel = (): Model<ErrorWrapperProps> => {
  const viewerStore = useStore()
  const errorType = viewerStore.form.errorType
  const view = viewerStore.formViewerPropsStore.view
  const viewerProps = useViewerProps()

  return useMemo(() => {
    const defaultModel = viewerProps.errorWrapper ? new Model(viewerProps.errorWrapper) : errorMessageModel
    const model = errorType ? view.find(errorType) : defaultModel
    return model ?? errorMessageModel
  }, [errorType, view, viewerProps.errorWrapper])
}
