import {Store} from '../../stores/Store'
import type {ComponentData} from '../../utils/contexts/ComponentDataContext'
import {createAnnotation, string} from '../annotation'
import {toArray} from '../annotation/toArray'
import type {ComponentMetadataEventListeners} from '../define/utils/ComponentMetadataEventListeners'
import {Meta} from '../define/utils/Meta'
import {isTemplateType} from '../ui/templateUtil'
import type {ModalProps} from './Modal'
import {modalModel} from './modalModel'

const modalProperties = toArray<ModalProps>({
  modalTemplate: string.required.setup({editor: 'componentType'}).withEditorProps({
    filter: (componentData: ComponentData) => isTemplateType(componentData.model.type)
  })
})

const modalProps = createAnnotation('modalProps')

const modalModules = [
  modalProps.build('modalProps')
]

const modalEventListeners: ComponentMetadataEventListeners = {
  onCreateNode: (node, store) => {
    const {form} = store

    if (!form.modalType && store instanceof Store) {
      form.modalType = store.getFirstComponentTypeWithRole('modal')
    }
  }
}

export const modalMeta = new Meta(modalModel.type, modalProperties, [], [], modalModules,
  undefined, undefined, undefined, modalEventListeners)
