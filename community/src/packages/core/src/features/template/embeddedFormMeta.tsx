import {boolean, disabled, object, readOnly, string} from '../annotation'
import {toArray} from '../annotation/toArray'
import {modules} from '../define/constants'
import {Meta} from '../define/utils/Meta'
import {embeddedFormModel, embeddedFormStyleProperties} from './embeddedFormModel'
import type {EmbeddedFormProps} from './EmbeddedFormProps'

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
