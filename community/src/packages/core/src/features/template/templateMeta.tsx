import {boolean} from '../annotation/booleanAnnotation'
import {disabled} from '../annotation/disabledAnnotation'
import {object} from '../annotation/objectAnnotation'
import {readOnly} from '../annotation/readOnlyAnnotation'
import {toArray} from '../annotation/toArray'
import {modules} from '../define/constants'
import {Meta} from '../define/utils/Meta'
import {generateTemplateTypeName} from '../ui/templateUtil'
import {embeddedFormStyleProperties} from './embeddedFormStyleProperties'
import type {TemplateProps} from './TemplateProps'

const storeDataInParentForm = boolean
  .default(true)
  .calculable(false)
  .hinted('Store data in parent form')
  .named('Store data in parent form')

const templateOptions = object
  .hinted('The additional options for loading the template')
  .named('Template options')

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
      options: templateOptions,
      disabled: disabled,
      readOnly: readOnly,
    }),
    [], embeddedFormStyleProperties, modules)
}
