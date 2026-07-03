import {Model} from '../define/utils/Model'
import {defaultEmbeddedFormCss} from './defaultEmbeddedFormCss'
import {EmbeddedForm} from './EmbeddedForm'

const defaultProps = {storeDataInParentForm: true}
const typeName = 'EmbeddedForm'

export const embeddedFormModel = new Model(EmbeddedForm, typeName, undefined, 'valued', 'object', defaultProps,
  defaultEmbeddedFormCss, undefined, typeName, 'template', 'readOnly', undefined, undefined, 'disabled')
