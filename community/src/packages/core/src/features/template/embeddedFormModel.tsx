import type {ReactNode} from 'react'
import {useMemo} from 'react'
import type {Store} from '../../stores/Store'
import {useBuilderMode} from '../../utils/contexts/BuilderModeContext'
import type {ComponentData} from '../../utils/contexts/ComponentDataContext'
import {useComponentData} from '../../utils/contexts/ComponentDataContext'
import {StoreProvider} from '../../utils/contexts/StoreContext'
import {createNonNullableContext} from '../../utils/createNonNullableContext'
import {isUndefined} from '../../utils/tools'
import {commonStyles, getDefaultCss} from '../annotation'
import {toStyleProperties} from '../annotation/toStyleProperties'
import {Model} from '../define'
import type {FormViewerProps} from '../form-viewer'
import {FormViewer} from '../form-viewer'
import {useViewerProps} from '../form-viewer/components/ViewerPropsContext'
import {TemplateField} from '../validation/utils/TemplateField'
import type {EmbeddedFormProps} from './EmbeddedFormProps'

const embeddedFormLoadErrorStyle = {
  fontSize: 'xx-large',
  color: 'red'
} as const

const EmbeddedFormLoadError = ({children}: { children: ReactNode }) => {
  return <span style={embeddedFormLoadErrorStyle}>{children}</span>
}

interface EmbeddedFormContext {
  data: ComponentData
  viewerProps: Readonly<FormViewerProps>
  embeddedFormProps: Record<string, any>
}

export const [
  /**
   * **Internal use only.**
   */
  useEmbeddedForm,
  /**
   * **Internal use only.**
   */
  EmbeddedFormProvider] = createNonNullableContext<EmbeddedFormContext>('EmbeddedFormContext')

/**
 * Displays the FormViewer component as a form component.
 * @param props the React component properties.
 * @returns the React element.
 */
export const EmbeddedForm = (props: EmbeddedFormProps) => {
  const viewerProps = useViewerProps()
  const data = useComponentData()
  const builderMode = useBuilderMode()

  const embeddedFormViewerProps = useMemo(() => {
    const overrideProps: Partial<FormViewerProps> = {
      formName: props.formName,
      formOptions: props.options,
      onFormDataChange: undefined,
      formValidators: undefined,
      disabled: props.disabled,
      readOnly: props.readOnly
    }
    return Object.assign({}, viewerProps, overrideProps)
  }, [viewerProps, props])

  const embeddedFormProviderValue = useMemo(() => {
    return ({embeddedFormProps: props, viewerProps, data})
  }, [props, viewerProps, data])

  if (!embeddedFormViewerProps.getForm) {
    return <EmbeddedFormLoadError>Please define the <code>getForm</code> property!</EmbeddedFormLoadError>
  }

  if (isUndefined(props.formName) && isUndefined(props.options)) {
    return builderMode === 'builder'
      ? <span>The name of the form and options are not specified, set at least one value to display the form</span>
      : null
  }

  if (!(data.field instanceof TemplateField)) return null
  const viewerStore = data.field.viewerStore as Store

  return (
    <EmbeddedFormProvider value={embeddedFormProviderValue}>
      <StoreProvider value={viewerStore}>
        <FormViewer {...embeddedFormViewerProps}/>
      </StoreProvider>
    </EmbeddedFormProvider>
  )
}
EmbeddedForm.displayName = 'EmbeddedForm'

export const embeddedFormStyleProperties = toStyleProperties(commonStyles)
export const defaultEmbeddedFormCss = getDefaultCss(embeddedFormStyleProperties)

const defaultProps = {storeDataInParentForm: true}
const typeName = 'EmbeddedForm'

export const embeddedFormModel = new Model(EmbeddedForm, typeName, undefined, 'valued', 'object', defaultProps,
  defaultEmbeddedFormCss, undefined, typeName, 'template', 'readOnly', undefined, undefined, 'disabled')
