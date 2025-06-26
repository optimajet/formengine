import {boolean, disabled, readOnly} from '../annotation'
import {toArray} from '../annotation/toArray'
import {modules} from '../define/constants'
import {Meta} from '../define/utils/Meta'
import {generateTemplateTypeName} from '../ui/templateUtil'
import {templateStyleProperties} from './templateModel'

interface TemplateProps {
  storeDataInParentForm?: boolean
  disabled?: boolean
  readOnly?: boolean
}

const storeDataInParentForm = boolean
  .default(true)
  .calculable(false)
  .hinted('Store data in parent form')
  .named('Store data in parent form')

/**
 * Creates the template component metadata for the form builder.
 * @param name the template name.
 * @returns the template component metadata for the form builder.
 */
export function createTemplateMeta(name: string) {
  const typeName = generateTemplateTypeName(name)
  return new Meta(typeName,
    toArray<TemplateProps>({
      storeDataInParentForm,
      disabled: disabled,
      readOnly: readOnly,
    }),
    [], templateStyleProperties, modules, undefined, undefined, 'template')
}
