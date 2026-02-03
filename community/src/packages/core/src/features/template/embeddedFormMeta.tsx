import {boolean} from '../annotation/booleanAnnotation'
import {disabled} from '../annotation/disabledAnnotation'
import {object} from '../annotation/objectAnnotation'
import {readOnly} from '../annotation/readOnlyAnnotation'
import {string} from '../annotation/stringAnnotation'
import {toArray} from '../annotation/toArray'
import {modules} from '../define/constants'
import {Meta} from '../define/utils/Meta'
import {embeddedFormModel} from './embeddedFormModel'
import type {EmbeddedFormProps} from './EmbeddedFormProps'
import {embeddedFormStyleProperties} from './embeddedFormStyleProperties'

const storeDataInParentForm = boolean
  .default(true)
  .calculable(false)

export const embeddedFormMeta = new Meta(embeddedFormModel.type,
  toArray<EmbeddedFormProps>({
    storeDataInParentForm,
    formName: string.setup({editor: 'formNamePicker'}),
    options: object,
    disabled: disabled,
    readOnly: readOnly,
  }),
  [], embeddedFormStyleProperties, modules)
