import type {CSSProperties, ReactNode} from 'react'
import {useMemo} from 'react'
import type {Store} from '../../stores/Store'
import type {ComponentData} from '../../utils/contexts/ComponentDataContext'
import {useComponentData} from '../../utils/contexts/ComponentDataContext'
import {StoreProvider} from '../../utils/contexts/StoreContext'
import {createNonNullableContext} from '../../utils/createNonNullableContext'
import {commonStyles, getDefaultCss} from '../annotation'
import {toStyleProperties} from '../annotation/toStyleProperties'
import {Model} from '../define'
import type {FormViewerProps} from '../form-viewer'
import {FormViewer} from '../form-viewer'
import {useViewerProps} from '../form-viewer/components/ViewerPropsContext'
import {generateTemplateTypeName, getTemplateName} from '../ui/templateUtil'
import {TemplateField} from '../validation/utils/TemplateField'
import type {TemplateProps} from './TemplateProps'

const templateLoadErrorStyle: CSSProperties = {
  fontSize: 'xx-large',
  color: 'red'
}

const TemplateLoadError = ({children}: { children: ReactNode }) => {
  return <span style={templateLoadErrorStyle}>{children}</span>
}

interface TemplateContext {
  data: ComponentData
  viewerProps: Readonly<FormViewerProps>
  templateProps: Record<string, any>
}

export const [
  /**
   * **Internal use only.**
   */
  useTemplate,
  /**
   * **Internal use only.**
   */
  TemplateProvider] = createNonNullableContext<TemplateContext>('TemplateContext')

const Template = (templateProps: TemplateProps) => {
  const viewerProps = useViewerProps()
  const data = useComponentData()
  const templateViewerProps = useMemo(() => {
    const overrideProps: Partial<FormViewerProps> = {
      formName: getTemplateName(data.store.type),
      formOptions: templateProps.options,
      onFormDataChange: undefined,
      formValidators: undefined,
      disabled: templateProps.disabled,
      readOnly: templateProps.readOnly
    }
    return Object.assign({}, viewerProps, overrideProps)
  }, [data.store.type, viewerProps, templateProps])

  const templateProviderValue = useMemo(() => ({templateProps, viewerProps, data}), [templateProps, viewerProps, data])

  if (!templateViewerProps.getForm) return <TemplateLoadError>Please define the <code>getForm</code> property!</TemplateLoadError>
  if (!(data.field instanceof TemplateField)) return null
  const viewerStore = data.field.viewerStore as Store

  return (
    <TemplateProvider value={templateProviderValue}>
      <StoreProvider value={viewerStore}>
        <FormViewer {...templateViewerProps}/>
      </StoreProvider>
    </TemplateProvider>
  )
}

export const templateStyleProperties = toStyleProperties(commonStyles)
const defaultCss = getDefaultCss(templateStyleProperties)

/**
 * Creates the template component metadata for the form viewer.
 * @param name the template name.
 * @returns the template component metadata for the form viewer.
 */
export function createTemplateModel(name: string) {
  const typeName = generateTemplateTypeName(name)
  const defaultProps = {name, storeDataInParentForm: true}
  return new Model(Template, name, undefined, typeName, 'object', defaultProps, defaultCss,
    undefined, typeName, 'template', 'readOnly', undefined, undefined, 'disabled')
}
