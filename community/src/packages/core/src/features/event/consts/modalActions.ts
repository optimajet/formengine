import {isRecord} from '../../../utils'
import {closeCurrentModalActionName} from '../../modal/closeCurrentModalActionName'
import {ActionDefinition} from '../types'

export const modalBeforeShowFnName = 'beforeShow'
export const modalBeforeHideFnName = 'beforeHide'
export const modalStateKey = 'modalState'

export const openModal = ActionDefinition.functionalAction(async (e, args) => {
  const {modalKey, useFormData} = args

  if (!modalKey) {
    console.warn(`Modal ${modalKey} is missing`)
    return
  }

  const {formData} = e.store
  const component = formData.findByKey(modalKey)
  if (!component) {
    console.warn(`Component ${modalKey} is not found`)
    return
  }

  const beforeShow = args[modalBeforeShowFnName]
  const beforeShowResult = beforeShow ? await beforeShow(undefined, undefined, args) : undefined
  if (beforeShowResult === false) return

  const initialDataRecord = useFormData === true
    ? formData.data
    : isRecord(beforeShowResult) ? beforeShowResult : undefined

  const initialData = isRecord(initialDataRecord) ? JSON.parse(JSON.stringify(initialDataRecord)) : undefined

  component.userDefinedProps ??= {}
  component.userDefinedProps[modalStateKey] = {
    open: true,
    initialData,
    [modalBeforeHideFnName]: args[modalBeforeHideFnName],
  }
}, {
  modalKey: 'string',
  useFormData: 'boolean',
  [modalBeforeShowFnName]: 'function',
  [modalBeforeHideFnName]: 'function'
})

export const closeModal = ActionDefinition.functionalAction(async (e, args) => {
  const modalContext = e.store.formViewerPropsStore.context?.modalContext ?? {}
  const postFn = modalContext[modalBeforeHideFnName]
  const modalResult = postFn ? await postFn(e, args) : undefined

  if (modalResult?.[modalBeforeHideFnName]) delete modalResult[modalBeforeHideFnName]

  const closeCurrentModal = modalContext[closeCurrentModalActionName]
  closeCurrentModal?.(modalResult)
}, {
  result: 'string'
})
