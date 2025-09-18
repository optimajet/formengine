import type {ReactNode} from 'react'
import {createElement, useCallback, useMemo} from 'react'
import {namedObserver} from '../../utils'
import {useComponentData} from '../../utils/contexts/ComponentDataContext'
import {useStore} from '../../utils/contexts/StoreContext'
import {useBuilderComponent} from '../../utils/useBuilderComponent'
import type {Model} from '../define'
import {modalBeforeHideFnName, modalStateKey} from '../event/consts/modalActions'
import {createDataProxy} from '../event/utils/createComponentDataProxy'
import type {FormViewerProps} from '../form-viewer'
import {FormViewer} from '../form-viewer'
import {useViewerProps} from '../form-viewer/components/ViewerPropsContext'
import {NewStoreProvider} from '../form-viewer/components/ViewerStoreProvider'
import {getTemplateName, isTemplateType} from '../ui/templateUtil'
import {closeCurrentModalActionName} from './closeCurrentModalActionName'
import {useModalComponentData} from './useModalComponentData'
import {useModalType} from './useModalType'

const useModalModel = () => {
  const modalType = useModalType()
  const formViewerProps = useViewerProps()
  if (!modalType) return
  return formViewerProps.view.get(modalType)
}

/**
 * The properties of the modal component.
 */
export interface ModalProps {
  /**
   * The modal form name.
   */
  modalTemplate: string
}

const RawModalBuilder = ({modalTemplate}: ModalProps) => {
  const modalModel = useModalModel()

  const modalTemplateName = useMemo(() => {
    return modalTemplate && isTemplateType(modalTemplate)
      ? getTemplateName(modalTemplate)
      : modalTemplate
  }, [modalTemplate])

  if (!modalModel) {
    return <div>Modal: specify the component to display the modal window to use</div>
  }

  if (!modalTemplate) {
    return <div>Modal: template not specified</div>
  }

  return <div>{`Modal: '${modalTemplateName}'`}</div>
}

const ModalBuilder = namedObserver('ModalBuilder', RawModalBuilder)

interface ComponentModalProps {
  open: boolean
  handleClose: (data: unknown) => void
  model: Model
  children: ReactNode
}

const RawComponentModal = ({open, handleClose, model, children}: ComponentModalProps) => {
  const wrappedComponentData = useComponentData()

  const modalComponentData = useModalComponentData(wrappedComponentData, model.type)
  const componentState = modalComponentData.componentState

  const props = {
    ...componentState.ownProps,
    open,
    handleClose
  }

  return createElement(model.component, props, children)
}

const ComponentModal = namedObserver('ComponentModal', RawComponentModal)

const RawModalViewer = (props: ModalProps) => {
  const formViewerProps = useViewerProps()
  const componentData = useComponentData()
  const parentStore = useStore()
  const {context} = parentStore.formViewerPropsStore
  const modalModel = useModalModel()
  const {modalTemplate} = props

  const {
    open = false,
    initialData,
    [modalBeforeHideFnName]: postFn,
  } = componentData?.userDefinedProps?.[modalStateKey] || {}

  const handleClose = useCallback((data: any) => {
    componentData.userDefinedProps ??= {}
    componentData.userDefinedProps[modalStateKey].open = false

    if (data) {
      const dataProxy = createDataProxy(parentStore.formData)
      Object.entries(data).forEach(([key, value]) => {
        dataProxy[key] = value
      })
    }
  }, [componentData, parentStore.formData])

  const contextValue = useMemo(() => ({
    ...formViewerProps.context,
    modalContext: {
      [closeCurrentModalActionName]: handleClose,
      [modalBeforeHideFnName]: postFn,
      parentContext: context
    }
  }), [context, formViewerProps.context, handleClose, postFn])

  const modalViewerProps: FormViewerProps = useMemo(() => ({
    ...formViewerProps,
    formName: getTemplateName(modalTemplate),
    initialData: initialData,
    errors: undefined,
    onFormDataChange: undefined,
    readOnly: undefined,
    disabled: undefined,
    context: contextValue
  }), [formViewerProps, modalTemplate, initialData, contextValue])

  if (!modalModel || !modalTemplate) return null

  return <ComponentModal model={modalModel} open={open} handleClose={handleClose}>
    <NewStoreProvider props={modalViewerProps}>
      <FormViewer {...modalViewerProps} />
    </NewStoreProvider>
  </ComponentModal>
}

const ModalViewer = namedObserver('ModalViewer', RawModalViewer)

/**
 * Displays a modal placeholder.
 * @param props the React component properties.
 * @returns the React element.
 */
export const Modal = (props: ModalProps) => {
  const Component = useBuilderComponent(ModalBuilder, ModalViewer)
  return <Component {...props}/>
}
Modal.displayName = 'Modal'
