import type {ActionValues} from '../types'
import {ActionDefinition} from '../types'
import {closeModal, openModal} from './modalActions'
import {addRowAction, removeRowAction} from './repeaterActions'

export const commonActions: ActionValues = {
  // eslint-disable-next-line no-console
  log: ActionDefinition.functionalAction(console.log),
  validate: ActionDefinition.functionalAction(async (e, args) => {
    const componentData = e.store.form.componentTree
    await componentData.validate()
    if (args.failOnError === true && componentData.hasErrors) {
      throw componentData.errors
    }
  }, {
    failOnError: 'boolean',
  }),
  clear: ActionDefinition.functionalAction(e => e.store.form.componentTree.clear()),
  reset: ActionDefinition.functionalAction(e => e.store.form.componentTree.reset()),
  addRow: addRowAction,
  removeRow: removeRowAction,
  openModal,
  closeModal,
}
