import {fastQrComponent, fastQrComponentsDescriptions} from '@react-form-builder/components-fast-qr'
import {googleMapComponent, googleMapComponentsDescriptions} from '@react-form-builder/components-google-map'
import {richTextComponent, richTextEditorComponentsDescriptions} from '@react-form-builder/components-rich-text'
import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rSuiteComponentsDescriptions,
  rtlCssLoader,
} from '@react-form-builder/components-rsuite'
import {rSuiteTableComponents, rSuiteTableComponentsDescriptions} from '@react-form-builder/components-rsuite-table'
import {signatureComponent, signatureComponentsDescriptions} from '@react-form-builder/components-signature'
import {BiDi, isUndefined, namedObserver} from '@react-form-builder/core'
import type {GenerateJsonFormSchemaOptions, IFormBuilder, IPresetComponentOptions, PresetComponent} from '@react-form-builder/designer'
import {BuilderView, FormBuilder} from '@react-form-builder/designer'
import type {IndexedDbFormStorage} from '@react-form-builder/indexed-db-form-storage'
import {IndexedDbPresetStorage} from '@react-form-builder/indexed-db-form-storage'
import {createSchema} from '@react-form-builder/json-schema-generator'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {RSuiteForm} from '../../forms'
import config from '../utils/config.json'
import {getFormFromJson} from '../utils/getFormFromJson'
import {licenseKey} from '../utils/licenseKey'
import type {FormBuilderAppProps} from '../utils/types'
import {useIndexedDbStorage} from '../utils/useIndexedDbStorage'
import {useSetBuilderRef} from './BuilderRefContext'

const components = [
  ...rSuiteComponents,
  fastQrComponent,
  richTextComponent,
  googleMapComponent,
  signatureComponent,
  ...rSuiteTableComponents,
].map(definer => definer.build())

const view = new BuilderView(components)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)
  .withComponentLibraryDescription(fastQrComponentsDescriptions)
  .withComponentLibraryDescription(googleMapComponentsDescriptions)
  .withComponentLibraryDescription(richTextEditorComponentsDescriptions)
  .withComponentLibraryDescription(signatureComponentsDescriptions)
  .withComponentLibraryDescription(rSuiteTableComponentsDescriptions)
  .withComponentLibraryDescription(rSuiteComponentsDescriptions)

const forms = {RSuiteForm}
const sampleFormName = 'RSuiteForm'

const RawRSuiteBuilder = ({appName = 'form-builder', ...props}: FormBuilderAppProps) => {
  const dbName = `${appName}-db`
  const storeName = `${appName}-store`
  const presetDbName = `${appName}-presets-db`
  const presetStoreName = `${appName}-presets`

  const [presetOptions, setPresetOptions] = useState<IPresetComponentOptions | undefined>(undefined)
  const builderRef = useRef<IFormBuilder>(null)
  const setBuilderRef = useSetBuilderRef()

  useEffect(() => {
    setBuilderRef?.(builderRef)
  }, [setBuilderRef])

  const {formStorage, initialized, indexedDbExists} = useIndexedDbStorage(dbName, storeName, forms)

  const presetStorage = useMemo(() => {
    return indexedDbExists ? new IndexedDbPresetStorage(presetDbName, presetStoreName) : undefined
  }, [indexedDbExists, presetDbName, presetStoreName])

  // getForm function is no longer needed as we use getFormFn directly

  const getFormFn = useCallback(
    (formName?: string) => {
      const name = !formName || isUndefined(formName) ? sampleFormName : formName
      if (!indexedDbExists || !formStorage) {
        return getFormFromJson(name)
      }
      return formStorage.getForm(name).catch(() => getFormFromJson(name))
    },
    [formStorage, indexedDbExists]
  )

  const initDatabase = useCallback(async (dbFormStorage: IndexedDbFormStorage) => {
    let cleanDatabase = true
    const accessDateKey = 'accessDate'
    const formNameKey = 'formName'

    try {
      const accessDate = localStorage.getItem(accessDateKey)
      if (accessDate && config.releaseDate === Number(accessDate)) cleanDatabase = false
    } catch (e) {
      console.error(e)
    }

    if (cleanDatabase) {
      localStorage.removeItem(formNameKey)
      localStorage.setItem(accessDateKey, `${config.releaseDate}`)
    }
    return await dbFormStorage.init({RSuiteForm})
  }, [])

  const getPresetOptions = useCallback((): IPresetComponentOptions | undefined => {
    if (!indexedDbExists) return undefined

    return {
      onCreate: (preset: PresetComponent) => {
        presetStorage?.savePreset(preset).catch(console.error)
      },
      onRemove: (name: string) => {
        presetStorage?.removePreset(name).catch(console.error)
      },
    }
  }, [indexedDbExists, presetStorage])

  const generateJsonFormSchema = useCallback((options: GenerateJsonFormSchemaOptions) => {
    const {components, descriptions} = options
    const schema = createSchema(components, descriptions)
    return JSON.stringify(schema, undefined, 2)
  }, [])

  useEffect(() => {
    async function initDb() {
      const presetComponents = await presetStorage?.loadPresets()
      const options = getPresetOptions()

      if (!isUndefined(presetComponents)) {
        setPresetOptions({
          ...options,
          components: presetComponents,
        })
      } else {
        setPresetOptions(options)
      }

      if (!formStorage) return
      await initDatabase(formStorage)
    }

    initDb().catch(e => console.error(e))
  }, [formStorage, presetStorage, getPresetOptions, initDatabase])

  if (!initialized) return null

  return (
    <FormBuilder
      licenseKey={licenseKey}
      getForm={getFormFn}
      formName={sampleFormName}
      view={view}
      formStorage={formStorage}
      presetComponentOptions={presetOptions}
      generateJsonFormSchema={generateJsonFormSchema}
      builderRef={builderRef}
      localStoragePrefix={`${appName}-rsuite`}
      {...props}
    />
  )
}

export const RSuiteBuilder = namedObserver('RSuiteBuilder', RawRSuiteBuilder)
