import {useEffect, useMemo, useRef, useState} from 'react'
import type {Store} from '../../../stores/Store'
import type {ViewMode} from '../../../types'
import {isPromise, namedObserver} from '../../../utils'
import {useStore} from '../../../utils/contexts/StoreContext'
import {globalDefaultLanguage} from '../../localization/default'
import {ComponentTree} from '../../ui/ComponentTree'
import {buildInternalErrorStore} from '../../ui/internalErrorModel'
import type {FormViewerProps} from '../types'
import {useViewerProps} from './ViewerPropsContext'

const getViewMode = (): ViewMode => {
  const width = globalThis.innerWidth

  if (width <= 600) return 'mobile'
  if (width <= 900) return 'tablet'

  return 'desktop'
}

function useAutoViewMode() {
  const store = useStore()
  const props = useViewerProps()

  useEffect(() => {
    if (props.viewMode) {
      store.viewMode = props.viewMode
      return
    }

    const onResize = () => store.viewMode = getViewMode()
    globalThis.addEventListener('resize', onResize)
    return () => globalThis.removeEventListener('resize', onResize)
  }, [props.viewMode, store])
}

const applyValidationErrors = (store: Store, errors?: Record<string, unknown>) => {
  store.form.componentTree.errors = errors ?? {}
}

const onFormLoadError = (store: Store, e: any) => {
  console.error(e)
  store.formLoadError = e?.message ?? e
  const componentStore = buildInternalErrorStore(e)
  store.applyPersistedForm({
    form: componentStore,
    localization: {},
    defaultLanguage: globalDefaultLanguage.fullCode,
    languages: []
  })
}

const applyForm = async (store: Store, getForm: FormViewerProps['getForm'], formName?: string,
                         options?: any) => {
  if (!getForm) return

  try {
    const form = getForm(formName, options)
    if (isPromise<string>(form)) {
      const data = await form
      store.applyStringForm(data)
      return
    }
    store.applyStringForm(form)
  } catch (e) {
    onFormLoadError(store, e)
  }
}

/**
 * The React component of the form viewer, which displays the form itself with its components.
 * @returns the React element.
 */
const RawViewer = () => {
  const store = useStore()
  const {formLoadError} = store
  const props = useViewerProps()
  const data = useMemo(() => [store.form.componentTree], [store.form.componentTree])

  const [formErrors, setFormErrors] = useState(props.errors)
  const errorsRef = useRef(formErrors)
  errorsRef.current = formErrors

  useAutoViewMode()

  useEffect(() => {
    applyForm(store, props.getForm, props.formName, props.formOptions)
      .then(() => {
        // we use ref because we don't want to have a dependency on props.errors in this effect.
        applyValidationErrors(store, errorsRef.current)
      })
      .catch(console.error)
  }, [store, props.getForm, props.formName, props.formOptions])

  useEffect(() => {
    if (formErrors !== props.errors) {
      setFormErrors(props.errors)
      errorsRef.current = props.errors
      applyValidationErrors(store, props.errors)
    }
  }, [formErrors, props.errors, store])

  return formLoadError
    ? <div className={'form-error'}>{formLoadError}</div>
    : <ComponentTree data={data}/>
}

export const Viewer = namedObserver('Viewer', RawViewer)
