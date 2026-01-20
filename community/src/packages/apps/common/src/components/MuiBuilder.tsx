import {builderView} from '@react-form-builder/components-material-ui'
import {namedObserver} from '@react-form-builder/core'
import type {IFormBuilder} from '@react-form-builder/designer'
import {FormBuilder} from '@react-form-builder/designer'
import {useCallback, useEffect, useRef} from 'react'
import {MuiForm} from '../../forms'
import {getFormFromJson} from '../utils/getFormFromJson'
import {licenseKey} from '../utils/licenseKey'
import type {FormBuilderAppProps} from '../utils/types'
import {useIndexedDbStorage} from '../utils/useIndexedDbStorage'
import {useSetBuilderRef} from './BuilderRefContext'

const sampleFormName = 'MuiForm'
const forms = {MuiForm}

const RawMuiBuilder = ({appName = 'form-builder', ...props}: FormBuilderAppProps) => {
  const dbName = `${appName}-mui-db`
  const storeName = `${appName}-store`
  const builderRef = useRef<IFormBuilder>(null)
  const setBuilderRef = useSetBuilderRef()

  useEffect(() => {
    setBuilderRef?.(builderRef)
  }, [setBuilderRef])

  const {formStorage, initialized, indexedDbExists} = useIndexedDbStorage(dbName, storeName, forms)

  const getFormFn = useCallback(
    (formName?: string) => {
      const name = formName ?? sampleFormName
      if (!indexedDbExists || !formStorage) {
        return getFormFromJson(name)
      }

      return formStorage.getForm(name).catch(() => getFormFromJson(name))
    },
    [formStorage, indexedDbExists]
  )

  if (!initialized) {
    return null
  }

  return (
    <FormBuilder
      licenseKey={licenseKey}
      getForm={getFormFn}
      formName={sampleFormName}
      localStoragePrefix={`${appName}-mui`}
      view={builderView}
      formStorage={formStorage}
      builderRef={builderRef}
      {...props}
    />
  )
}

export const MuiBuilder = namedObserver('MuiBuilder', RawMuiBuilder)
