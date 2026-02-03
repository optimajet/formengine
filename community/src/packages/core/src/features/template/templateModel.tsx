import {useComponentData} from '../../utils/contexts/ComponentDataContext'
import {Model} from '../define/utils/Model'
import {generateTemplateTypeName, getTemplateName} from '../ui/templateUtil'
import {defaultEmbeddedFormCss} from './defaultEmbeddedFormCss'
import {EmbeddedForm} from './EmbeddedForm'
import type {TemplateProps} from './TemplateProps'
import {templateTypeName} from './templateTypeName'

const Template = (templateProps: TemplateProps) => {
  const {store} = useComponentData()
  return <EmbeddedForm {...templateProps} formName={getTemplateName(store.type)}/>
}

export const templateModel = new Model(Template, templateTypeName, undefined, templateTypeName, 'object',
  undefined, defaultEmbeddedFormCss, undefined, templateTypeName, 'template', 'readOnly',
  undefined, undefined, 'disabled')

/**
 * Creates the template component metadata for the form viewer.
 * @param name the template name.
 * @returns the template component metadata for the form viewer.
 */
export function createTemplateModel(name: string) {
  const typeName = generateTemplateTypeName(name)
  const defaultProps = {name, storeDataInParentForm: true}
  return new Model(Template, name, undefined, typeName, 'object', defaultProps, defaultEmbeddedFormCss,
    undefined, typeName, 'template', 'readOnly', undefined, undefined, 'disabled')
}
