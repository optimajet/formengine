import {Store} from '../../stores/Store'
import {string} from '../annotation/stringAnnotation'
import {toArray} from '../annotation/toArray'
import {createAnnotation} from '../annotation/utils/createAnnotation'
import type {ComponentMetadataEventListeners} from '../define/utils/ComponentMetadataEventListeners'
import {Meta} from '../define/utils/Meta'
import type {ModalProps} from './Modal'
import {modalModel} from './modalModel'

const modalProperties = toArray<ModalProps>({
  modalTemplate: string.required.setup({editor: 'templateTypePicker'})
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
