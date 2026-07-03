import type {ForwardedRef, ReactNode} from 'react'
import {createElement, useCallback, useImperativeHandle, useMemo, useRef} from 'react'
import {useComponentData} from '../../utils/contexts/ComponentDataContext'
import {useStore} from '../../utils/contexts/StoreContext'
import {namedObserver} from '../../utils/namedObserver'
import {useBuilderComponent} from '../../utils/useBuilderComponent'
import type {Model} from '../define/utils/Model'
import {modalBeforeHideFnName, modalOnCloseEventHandler, modalStateKey} from '../event/consts/modalActions'
import {createDataProxy} from '../event/utils/createComponentDataProxy'
import {useViewerProps} from '../form-viewer/components/ViewerPropsContext'
import {NewStoreProvider} from '../form-viewer/components/ViewerStoreProvider'
import {useEmbeddedFormViewer} from '../form-viewer/EmbeddedFormViewerContext'
import type {FormViewerProps} from '../form-viewer/types'
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

type OnCloseEventHandler = () => void

interface ComponentModalProps {
  open: boolean
  handleClose: (data: unknown) => void
  onCloseRef: ForwardedRef<OnCloseEventHandler>
  model: Model
  children: ReactNode
}

const RawComponentModal = ({open, handleClose, model, children, onCloseRef}: ComponentModalProps) => {
  const wrappedComponentData = useComponentData()

  const modalComponentData = useModalComponentData(wrappedComponentData, model.type)
  const componentState = modalComponentData.componentState

  useImperativeHandle(onCloseRef, () => {
    return () => {
      modalComponentData.componentState.ownProps.onClose?.()
    }
  }, [modalComponentData.componentState.ownProps])

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
  const EmbeddedFormViewer = useEmbeddedFormViewer()
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

  const modalRef = useRef<OnCloseEventHandler>(null)

  const modalOnClose = useCallback(() => {
    modalRef?.current?.()
  }, [])

  const contextValue = useMemo(() => ({
    ...formViewerProps.context,
    modalContext: {
      [closeCurrentModalActionName]: handleClose,
      [modalOnCloseEventHandler]: modalOnClose,
      [modalBeforeHideFnName]: postFn,
      parentContext: context
    }
  }), [context, formViewerProps.context, handleClose, modalOnClose, postFn])

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

  return <ComponentModal model={modalModel} open={open} handleClose={handleClose} onCloseRef={modalRef}>
    <NewStoreProvider props={modalViewerProps}>
      <EmbeddedFormViewer {...modalViewerProps} />
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
  return useBuilderComponent(ModalBuilder, ModalViewer, props)
}
