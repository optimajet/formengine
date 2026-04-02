import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rtlCssLoader
} from '@react-form-builder/components-rsuite'
import {BiDi} from '@react-form-builder/core'
import {BuilderView, FormBuilder} from '@react-form-builder/designer'
import {IndexedDbFormStorage} from '@react-form-builder/indexed-db-form-storage'
import {useEffect, useState} from 'react'
import * as SampleForm from './SampleForm.json'

const builderComponents = rSuiteComponents.map(c => c.build())
const builderView = new BuilderView(builderComponents)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)

const divStyle = {height: '100vh'}

const formStorage = new IndexedDbFormStorage('form-builder-example-db', 'form-builder-example-store')

/**
 * @returns the FormBuilder example page component.
 */
export const FormBuilderExample = () => {
  const [ready, setReady] = useState<boolean>(false)

  useEffect(() => {
    formStorage.init({
      SampleForm: JSON.stringify(SampleForm)
    }).then(() => {
      setReady(true)
    }).catch(console.error)
  }, [])

  if (!ready) return null

  return (
    <div style={divStyle}>
      <FormBuilder view={builderView} formStorage={formStorage} formName="SampleForm"/>
    </div>
  )
}
