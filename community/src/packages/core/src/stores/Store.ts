import {makeObservable, observable, runInAction} from 'mobx'
import type {Model} from '../features/define'
import type {ComponentRole} from '../features/define/utils/ComponentRole'
import type {ActionData, ActionDefinition, ActionType} from '../features/event'
import {createActionValuesFromObject} from '../features/event'
import {commonActions} from '../features/event/consts/actions'
import type {IFormViewer} from '../features/form-viewer'
import {globalDefaultLanguage} from '../features/localization/default'
import {findLanguage} from '../features/localization/findLanguage'
import {localizeErrorMessage, localizeProperties} from '../features/localization/localizer'
import {Language} from '../features/localization/types'
import type {ComponentPropertiesContext} from '../features/properties-context/ComponentPropertiesContext'
import {createTemplateModel} from '../features/template'
import {buildInternalErrorModel} from '../features/ui/internalErrorModel'
import {screenModel} from '../features/ui/screenModel'
import {getTemplateName, isTemplateType} from '../features/ui/templateUtil'
import type {SchemaType} from '../features/validation'
import {DataValidator} from '../features/validation'
import type {ValidationResult} from '../features/validation/types/ValidationResult'
import {calculateProperty} from '../features/validation/utils/calculateProperty'
import type {CalculatePropertyFn} from '../features/validation/utils/CalculatePropertyFn'
import {codeValidationRule, ZodValidationRules} from '../features/validation/utils/consts'
import {dataPart} from '../features/validation/utils/dataPart'
import type {ErrorMessageLocalizer} from '../features/validation/utils/DataValidator'
import {getDefaultErrorMessage} from '../features/validation/utils/DataValidator'
import type {DataValidatorFactoryFn} from '../features/validation/utils/DataValidatorFactoryFn'
import type {GetInitialDataFn} from '../features/validation/utils/GetInitialDataFn'
import type {IComponentDataFactory} from '../features/validation/utils/IComponentDataFactory'
import {RepeaterField} from '../features/validation/utils/RepeaterField'
import type {SetInitialDataFn} from '../features/validation/utils/SetInitialDataFn'
import {SimpleField} from '../features/validation/utils/SimpleField'
import {TemplateField} from '../features/validation/utils/TemplateField'
import {isStoreDataInParentForm} from '../features/validation/utils/util'
import {typedValidatorsResolver} from '../features/validation/utils/validatorsResolver'
import type {Setter, ViewMode} from '../types'
import {isNumber, isRecord, isString} from '../utils'
import {ComponentData} from '../utils/contexts/ComponentDataContext'
import type {IFormData} from '../utils/IFormData'
import {nameObservable} from '../utils/observableNaming'
import {isUndefined} from '../utils/tools'
import {ComponentStore, dataKey} from './ComponentStore'
import {Form} from './Form'
import type {FormViewerPropsStore} from './FormViewerPropsStore'
import type {FormViewerValidationRules} from './FormViewerValidationRules'
import type {IComponentState} from './IComponentState'
import type {IStore} from './IStore'
import type {LocalizationType} from './LocalizationStore'
import {LocalizationStore} from './LocalizationStore'
import type {PersistedForm} from './PersistedForm'
import {PersistedFormVersion} from './PersistedForm'

const propertiesToFix: Record<string, string[]> = {
  'RsDatePicker': ['calendarDefaultDate', 'defaultValue', 'value'],
  'RsCalendar': ['defaultValue', 'value'],
}

/**
 * Reduction function type.
 */
type ReduceCallback<U, T> = (accumulator: T, current: U) => T

/**
 * Type for a tree object.
 */
type Tree<T, U extends keyof T> = T & { [K in U]: Tree<T, K>[] | undefined }

function reduceTree<U extends object, T, K extends keyof U>(tree: Tree<U, K>,
                                                            callback: ReduceCallback<Tree<U, K>, T>,
                                                            initialValue: T, childKey: K) {
  let accumulator = callback(initialValue, tree)
  tree[childKey]?.forEach((child: Tree<U, K>) => {
    accumulator = reduceTree(child, callback, accumulator, childKey)
  })
  return accumulator
}

/**
 * The component state factory that calculates the properties of the form viewer component.
 * @param data the data needed to display the component.
 * @param store the form viewer settings.
 * @param context the context for working with component properties.
 * @returns the component property calculator.
 */
export type ComponentStateFactory = (data: ComponentData, store: Store, context?: ComponentPropertiesContext) => IComponentState

/**
 * The form viewer settings. **Internal use only.**
 */
export class Store implements IStore, IFormViewer, IComponentDataFactory {

  /**
   * The currently selected language.
   */
  selectedLanguage?: Language

  /**
   * Current display resolution type.
   */
  viewMode: ViewMode = 'desktop'

  /**
   * The form.
   */
  form: Form

  /**
   * Models for templates that have not been explicitly defined.
   */
  #templateMap = new Map<string, Model>()

  /**
   * The loading form error.
   */
  formLoadError?: string

  /**
   * Creates form viewer settings.
   * @param formViewerPropsStore the form viewer store settings.
   * @param componentStateFactory the factory for creating component states.
   * @param parentStore the form viewer settings, used in templates.
   * @param getInitialData the function to get initial data for the Store.
   * @param setInitialData the function for updating initial data.
   */
  constructor(public formViewerPropsStore: FormViewerPropsStore,
              public readonly componentStateFactory: ComponentStateFactory,
              public readonly parentStore?: Store,
              public readonly getInitialData?: GetInitialDataFn,
              public readonly setInitialData?: SetInitialDataFn
  ) {
    const componentTree = this.createDataRoot()
    const localization = new LocalizationStore()
    this.form = new Form(componentTree, localization, {}, [], globalDefaultLanguage)
    this.form.modalType = this.getFirstComponentTypeWithRole('modal')
    this.form.tooltipType = this.getFirstComponentTypeWithRole('tooltip')

    makeObservable(this, {
      form: observable,
      viewMode: true,
      selectedLanguage: true,
      clear: true,
      parentStore: observable.ref,
      initialDataSlice: true,
      formLoadError: true
    }, {name: nameObservable(`ViewerStore`)})
  }

  /**
   * @returns the Record with the common actions.
   */
  get commonActions() {
    return commonActions
  }

  /**
   * Returns an action by the specified action name and action type.
   * @param name the action name.
   * @param type the action type.
   * @returns the action.
   */
  getAction(name: string, type: ActionType) {
    let action: ActionDefinition | undefined = undefined
    switch (type) {
      case 'common':
        action = this.commonActions[name]
        break
      case 'code':
        action = this.form.actions[name]
        break
      case 'custom':
        action = this.formViewerPropsStore.actions?.[name]
        break
    }

    if (!action) throw Error(`Action '${name}' with type '${type}' not found!`)
    return action
  }

  /**
   * @inheritDoc
   */
  get formData() {
    return this.form.componentTree
  }

  /**
   * Clears the form in Form Viewer.
   */
  clear() {
    const oldForm = this.form
    const componentTree = this.createDataRoot()
    const localization = new LocalizationStore()
    this.form = new Form(componentTree, localization, {}, oldForm.languages, oldForm.defaultLanguage)
    this.form.modalType = this.getFirstComponentTypeWithRole('modal')
    this.form.tooltipType = this.getFirstComponentTypeWithRole('tooltip')
    oldForm.dispose()
  }

  /**
   * @inheritDoc
   */
  dispose() {
    this.form.dispose()
  }

  /**
   * @inheritDoc
   */
  get initialDataSlice(): unknown {
    return this.parentStore ? this.getInitialData?.() : this.formViewerPropsStore.initialData
  }

  /**
   * @inheritDoc
   */
  get showAllValidationErrors(): boolean | undefined {
    return this.formViewerPropsStore?.showAllValidationErrors
  }

  /**
   * @inheritDoc
   */
  reduceScreen<T>(callback: (accumulator: T, current: ComponentData) => T, initialValue: T) {
    return reduceTree(this.form.componentTree, callback, initialValue, 'children')
  }

  /**
   * Searches for an action, returns definition for the found action.
   * @param actionData the action's data.
   * @returns the action definition.
   * @throws Error, if action was not found.
   */
  findAction(actionData: ActionData) {
    return this.getAction(actionData.name, actionData.type)
  }

  /**
   * Returns model for the specified type.
   * @param type the component type.
   * @returns the model for the specified type.
   */
  getModel(type: string) {
    const model = this.formViewerPropsStore.view.find(type)
    if (model) return model
    if (isTemplateType(type)) {
      const templateModel = this.#templateMap.get(type)
      return templateModel ?? this.addTemplateModel(type)
    }
    return buildInternalErrorModel(`Type '${type}' is not found!`)
  }

  private addTemplateModel(type: string) {
    // we don't change the view properties to add a template
    const templateName = getTemplateName(type)
    const templateModel = createTemplateModel(templateName)
    this.#templateMap.set(templateModel.type, templateModel)
    return templateModel
  }

  /**
   * @inheritDoc
   */
  createComponentData(componentStore: ComponentStore, deferFieldCalculation = false): ComponentData {
    const model = this.getModel(componentStore.type)
    const factory = (cs: ComponentStore) => this.createComponentData(cs, deferFieldCalculation)
    const componentData = new ComponentData(componentStore, model, factory, this.getFormValidatorsResult.bind(this))
    componentData.field = this.createField(componentData, deferFieldCalculation)
    componentData.componentState = this.componentStateFactory(componentData, this)
    return componentData
  }

  /**
   * Returns the object with validators for the specified value type.
   * @param type the value type.
   * @returns the object with validators for the specified value type.
   */
  getValidationRules(type: SchemaType): FormViewerValidationRules {
    return {
      custom: this.formViewerPropsStore.validators?.[type],
      internal: {
        ...ZodValidationRules[type],
        code: codeValidationRule
      }
    }
  }

  private createField(componentData: ComponentData, deferFieldCalculation: boolean) {
    const {model, store: componentStore} = componentData
    if (!model.valued || model.dataBindingType !== 'twoWay') return

    const calculateValue: CalculatePropertyFn = (component: ComponentStore, key: string) => {
      return this.calculateProperty(componentData, component, key)
    }

    const createDataValidator: DataValidatorFactoryFn = (componentData: ComponentData,
                                                         valueType: SchemaType,
                                                         onError: Setter<string | undefined>) => {
      return this.createDataValidator(componentData, valueType, onError)
    }

    const getInitialData: GetInitialDataFn = () => {
      return dataPart(componentData.initialData, dataKey(componentStore))
    }

    if (model.kind === 'repeater') {
      const repeaterSetInitialData = (value: unknown) => {
        const repeaterKey = dataKey(componentStore)
        componentData.dataRoot.updateInitialData(repeaterKey, value)
      }

      return new RepeaterField(componentData, calculateValue, createDataValidator, getInitialData, repeaterSetInitialData,
        this, deferFieldCalculation)
    }

    if (!isTemplateType(model.type)) {
      return new SimpleField(componentData, calculateValue, createDataValidator, getInitialData, deferFieldCalculation)
    }

    const templateGetInitialData: GetInitialDataFn = () => {
      if (isStoreDataInParentForm(componentStore)) return componentData.initialData
      return dataPart(componentData.initialData, dataKey(componentStore))
    }

    const templateSetInitialData = (key: string | number, value: unknown) => {
      if (isStoreDataInParentForm(componentStore)) return this.updateInitialData(key, value)

      const templateKey = dataKey(componentStore)
      const initial = dataPart(componentData.initialData, templateKey) ?? {}
      if (isRecord(initial)) initial[key] = value
      this.updateInitialData(templateKey, initial)
    }

    const childStore = new Store(this.formViewerPropsStore.clone(), this.componentStateFactory, this, templateGetInitialData,
      templateSetInitialData)
    return new TemplateField(componentStore, childStore)
  }

  /**
   * Populates the value of this store with the values of the saved form.
   * @param text saved form value.
   */
  applyStringForm(text: string) {
    try {
      const persistedForm = JSON.parse(text) as PersistedForm
      this.fixPropertyTypes(persistedForm.form)
      this.applyPersistedForm(persistedForm)
      this.formLoadError = undefined
    } catch (e) {
      this.formLoadError = (e as Error)?.message ?? e
      console.error(e)
    }
  }

  private fixPropertyTypes(componentStore: ComponentStore) {
    if (!componentStore.props) {
      componentStore.props = {}
    }

    // workaround, we need to restore the ComponentStore along with metadata information
    const properties = propertiesToFix[componentStore.type]
    properties?.forEach(property => this.fixDateProperty(componentStore, property))
    componentStore.children?.forEach(child => this.fixPropertyTypes(child))
  }

  private fixDateProperty(componentStore: ComponentStore, property: string) {
    const value = componentStore.props[property]?.value
    if (isString(value) || isNumber(value)) {
      componentStore.props[property].value = new Date(value)
    }
  }

  /**
   * Populates the value of this store with the values of the saved form.
   * @param persistedForm saved form value.
   */
  applyPersistedForm(persistedForm: PersistedForm) {
    const oldForm = this.form

    const version = persistedForm.version
    if (!isUndefined(version) && version !== PersistedFormVersion.version1) {
      console.warn(`An unsupported version of form '${version}' has been detected. An attempt will be made to upload` +
        ` the form as version '${PersistedFormVersion.version1}'.`)
    }

    runInAction(() => {
      const componentStore: ComponentStore = ComponentStore.createFromObject(persistedForm.form)

      const componentData = this.createComponentData(componentStore, true)
      componentData.getInitialData = () => this.initialDataSlice
      componentData.setInitialData = this.updateInitialData

      const localization = new LocalizationStore(Object.assign({}, persistedForm.localization))

      const languages = persistedForm.languages?.map(Language.clone) ?? []
      const defaultLanguage = languages.find(l => l.fullCode === persistedForm.defaultLanguage) ?? globalDefaultLanguage

      const actions = createActionValuesFromObject(persistedForm.actions)

      this.form = new Form(componentData, localization, actions, languages, defaultLanguage)

      this.form.errorProps = persistedForm.errorProps ?? {}
      this.form.tooltipType = persistedForm.tooltipType
      this.form.errorType = persistedForm.errorType
      this.form.modalType = persistedForm.modalType
      this.form.formValidator = persistedForm.formValidator
    })

    // here we need to make the keys unique, because no reactions will be triggered during the action
    this.form.componentTree.unifyTree()
    // here we initialize the fields after the form is created, since the calculated field values are depends on 'this.form'
    this.form.initFields()
    oldForm.dispose()
  }

  /**
   * @returns the current display language.
   */
  get displayedLanguage(): Language {
    if (this.parentStore) return this.parentStore.displayedLanguage
    if (this.formViewerPropsStore.propsLanguage) {
      const propsLanguage = findLanguage(this.form.languages, this.formViewerPropsStore.propsLanguage)
      if (propsLanguage) return propsLanguage
    }
    return this.selectedLanguage ?? this.form.defaultLanguage
  }

  /**
   * @inheritDoc
   */
  localizeComponent(type: LocalizationType, formData: IFormData, componentStore: ComponentStore) {
    if (this.formViewerPropsStore.localizer) return this.formViewerPropsStore.localizer(componentStore, this.displayedLanguage)
    return localizeProperties(this.form, formData, this.displayedLanguage, componentStore, type)
  }

  /**
   * @inheritDoc
   */
  localizeErrorMessages(formData: IFormData, componentStore: ComponentStore, validationResults?: ValidationResult[]) {
    if (!validationResults) return
    return validationResults.map(result => {
      const errorMessage = localizeErrorMessage(this.form, formData, this.displayedLanguage, componentStore, result.settings.key)
      return errorMessage ?? getDefaultErrorMessage(result)
    })
  }

  private calculateProperty(componentData: ComponentData, component: ComponentStore, key: string) {
    const dataRoot = componentData.dataRoot
    return calculateProperty(
      component,
      key,
      dataRoot,
      (type, componentStore) => this.localizeComponent(type, dataRoot, componentStore)
    )
  }

  /**
   * Creates a data validator for the field.
   * @param componentData the component data.
   * @param valueType the field's data type.
   * @param onError the callback function called when the validation error text is set.
   * @returns the data validator.
   */
  private createDataValidator(componentData: ComponentData, valueType: SchemaType,
                              onError: Setter<string | undefined>) {
    const validationRules = this.getValidationRules(valueType)
    const localizer: ErrorMessageLocalizer = (validationResults) => {
      return this.localizeErrorMessages(componentData.dataRoot, componentData.store, validationResults)
    }
    return DataValidator.create(
      this,
      () => componentData.dataRoot,
      typedValidatorsResolver(validationRules),
      componentData.store.schema,
      onError,
      localizer
    )
  }

  private createDataRoot() {
    const componentStore = new ComponentStore(screenModel.name, screenModel.type)
    const componentData = this.createComponentData(componentStore)
    componentData.getInitialData = () => this.initialDataSlice
    componentData.setInitialData = this.updateInitialData
    return componentData
  }

  private async getFormValidatorsResult() {
    const validatorsFromProps = this.formViewerPropsStore.formValidators
    const formValidator = this.form.formValidatorFunction

    const validatorPromises = []
    if (validatorsFromProps) {
      validatorPromises.push(...validatorsFromProps.map(v => v(this.form.componentTree.data)))
    }
    if (formValidator) {
      validatorPromises.push(formValidator(this.form.componentTree?.data ?? {}))
    }

    const settledPromises = await Promise.allSettled(validatorPromises)
    const results = settledPromises?.map(result => {
      if (result.status === 'rejected') {
        console.error(result.reason)
        return undefined
      }
      return result.value
    })

    return results.filter(value => !isUndefined(value)) as Record<string, string>[]
  }

  /**
   * Returns the first type of component with the specified role.
   * @param componentRole the component role.
   * @returns the first type of component with the specified role.
   */
  getFirstComponentTypeWithRole(componentRole: ComponentRole) {
    const components = this.formViewerPropsStore.view
      .filterModels(model => model.hasComponentRole(componentRole))
      .map(model => model.type)
    return components.length ? components[0] : undefined
  }

  private updateInitialData = (key: string | number, value: unknown) => {
    if (this.setInitialData) {
      this.setInitialData(key, value)
      return
    }

    this.formViewerPropsStore.initialData[key] = value
  }
}
