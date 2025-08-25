import {makeAutoObservable} from 'mobx'
import type {ActionData, ActionValues, NamedActionDefinition} from '../features/event'
import {ActionDefinition} from '../features/event'
import type {FormValidator} from '../features/form-viewer/FormValidators'
import type {Language} from '../features/localization/types'
import {AsyncFunction} from '../utils/AsyncFunction'
import type {ComponentData} from '../utils/contexts/ComponentDataContext'
import {generateUniqueName} from '../utils/generateUniqueName'
import type {ComponentStore} from './ComponentStore'
import type {LocalizationStore} from './LocalizationStore'

/**
 * Represents a form that is rendered in Viewer or edited in Builder.
 */
export class Form {
  /**
   * Root component of the form.
   */
  readonly componentTree: ComponentData

  /**
   * Localization of the form.
   */
  readonly localization: LocalizationStore

  /**
   * Localization languages of the form.
   */
  readonly languages: Language[] = []

  /**
   * The set of action definitions.
   */
  readonly actions: ActionValues

  /**
   * Properties of the component displaying the error.
   */
  errorProps: any = {}

  /**
   * The type name of the component displaying the tooltip.
   */
  tooltipType?: string

  /**
   * The type name of the component displaying the error.
   */
  errorType?: string

  /**
   * The type name of the component displaying the modal.
   */
  modalType?: string

  /**
   * Default localization language of the form.
   */
  defaultLanguage: Language

  /**
   * The form validator.
   */
  formValidator?: string

  /**
   * Creates a new instance of Form.
   * @param componentTree the root component of the form.
   * @param localization the localization of the form.
   * @param actions the form custom actions.
   * @param languages the localization languages of the form.
   * @param defaultLanguage the default localization language of the form.
   */
  constructor(componentTree: ComponentData, localization: LocalizationStore, actions: ActionValues,
              languages: Language[], defaultLanguage: Language) {
    this.componentTree = componentTree
    this.localization = localization
    this.actions = actions
    this.languages = languages
    this.defaultLanguage = defaultLanguage

    this.componentTree.events.onBeforeDelete.subscribe(this.onComponentDataBeforeDelete.bind(this))
    this.componentTree.events.onAfterKeyChanged.subscribe(this.onComponentDataAfterKeyChanged.bind(this))

    makeAutoObservable(this)
  }

  /**
   * @returns the actions names array.
   */
  get actionNames(): string[] {
    return Object.keys(this.actions)
  }

  /**
   * @returns the form validator function.
   */
  get formValidatorFunction(): FormValidator | undefined {
    if (!this.formValidator) return
    return AsyncFunction('formData', this.formValidator)
  }

  /**
   * Initializes form fields.
   */
  initFields() {
    this.componentTree.allFields.forEach(field => field.init())
  }

  /**
   * Disposes the form. Disposes all the components and localization.
   */
  dispose() {
    this.componentTree.dispose()
  }

  /**
   * Removes the action from the form.
   * @param name the action name to remove.
   */
  removeAction(name: string) {
    delete this.actions[name]
    this.removeCodeActionBinding(name, this.componentTree.store)
  }

  /**
   * Changes the existing action to the new one, adds the action if the existing action is not found.
   * @param oldActionName the existing action name.
   * @param newAction the new named action.
   */
  updateOrAddAction(oldActionName: string, newAction: NamedActionDefinition) {
    this.actions[newAction.name] = newAction.actionDefinition
    this.rebindActionHandlers(this.componentTree.store, oldActionName, newAction)
    if (oldActionName !== newAction.name) {
      delete this.actions[oldActionName]
    }
  }

  /**
   * Clones the action.
   * @param namedAction the named action to clone.
   */
  cloneAction(namedAction: NamedActionDefinition) {
    if (!this.actions) return
    const existingNames = new Set(this.actionNames)
    const data = JSON.parse(JSON.stringify(namedAction.actionDefinition))
    const actionName = generateUniqueName(`${namedAction.name}_`, existingNames)
    this.actions[actionName] = ActionDefinition.createFromObject(data)
  }

  private rebindActionData(actionData: ActionData, newAction: NamedActionDefinition) {
    actionData.name = newAction.name
    const args = actionData.args
    if (!args) return

    const newActionParamNames = new Set<string>(Object.keys(newAction.actionDefinition.params))
    Object.keys(args).forEach(key => {
      if (!newActionParamNames.has(key)) delete args[key]
    })
  }

  private rebindActionHandlers(componentStore: ComponentStore, oldActionName: string, newAction: NamedActionDefinition) {
    const events = componentStore.events
    if (events) {
      Object.keys(events).forEach(value => {
        const bindings = events[value]
        bindings?.filter(item => item.type === 'code' && item.name === oldActionName)
          .forEach(item => this.rebindActionData(item, newAction))
      })
    }
    componentStore.children?.forEach(item => {
      this.rebindActionHandlers(item, oldActionName, newAction)
    })
  }

  private removeCodeActionBinding(actionName: string, componentStore: ComponentStore) {
    const events = componentStore.events
    if (events) {
      Object.keys(events).forEach(value => {
        const bindings = events[value]
        if (!bindings.length) return
        events[value] = bindings.filter(item => !(item.type === 'code' && item.name === actionName))
      })
    }
    componentStore.children?.forEach(item => this.removeCodeActionBinding(actionName, item))
  }

  private onComponentDataBeforeDelete(component: ComponentData) {
    this.localization.removeLocalization(component.key)
  }

  private onComponentDataAfterKeyChanged(_: ComponentData, {oldKey, newKey}: { oldKey: string, newKey: string }) {
    this.localization.changeComponentKey(oldKey, newKey)
  }
}
