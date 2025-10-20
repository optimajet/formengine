import {autorun, makeAutoObservable, observable, reaction, runInAction} from 'mobx'
import {ComponentStore, dataKey, isComputedProperty} from '../../../stores/ComponentStore'
import {isRecord} from '../../../utils'
import type {ComponentData, IComponentDataProvider} from '../../../utils/contexts/ComponentDataContext'
import {mergeData} from '../../../utils/data-utils'
import {needRender} from '../../../utils/needRender'
import {nameAutorun, nameObservable} from '../../../utils/observableNaming'
import {isNull, isUndefined} from '../../../utils/tools'
import type {Model} from '../../define'
import type {SchemaType} from '../types/SchemaType'
import type {ValidationMessages} from '../types/ValidationResult'
import type {CalculatePropertyFn} from './CalculatePropertyFn'
import type {DataValidator} from './DataValidator'
import type {DataValidatorFactoryFn} from './DataValidatorFactoryFn'
import type {Disposer} from './Disposer'
import type {Field} from './Field'
import type {FieldType} from './FieldType'
import type {GetInitialDataFn} from './GetInitialDataFn'
import type {IComponentDataFactory} from './IComponentDataFactory'
import type {IDataReaction} from './IDataReaction'

/**
 * Field with repeater data. **Internal use only.**
 */
export class RepeaterField implements Field, IDataReaction, IComponentDataProvider {

  #oldComponentDatas: ComponentData[] = []

  /**
   * @inheritDoc
   */
  error?: string

  /**
   * @inheritDoc
   */
  touched = false

  /**
   * @inheritDoc
   */
  valued: string
  /**
   * The type of the field value.
   */
  valueType: SchemaType
  dataValidator?: DataValidator
  readonly #disposers: Disposer[]
  #dataReactionDisposer?: Disposer

  initialData: unknown
  readonly componentStore: ComponentStore
  readonly model: Model

  /**
   * Creates the field with repeater data for the component.
   * @param repeaterComponentData the component data.
   * @param calculateValue the function for calculating the value of the field.
   * @param createDataValidator the function to create a data validator.
   * @param getInitialData the function to get initial data for the field.
   * @param setInitialData the function to update initial data for the field.
   * @param componentDataFactory the factory for creating ComponentData instances.
   * @param deferFieldCalculation if true, then the calculated field must be explicitly initialized.
   */
  constructor(
    readonly repeaterComponentData: ComponentData,
    readonly calculateValue: CalculatePropertyFn,
    readonly createDataValidator: DataValidatorFactoryFn,
    readonly getInitialData: GetInitialDataFn,
    readonly setInitialData: (value: unknown) => void,
    readonly componentDataFactory: IComponentDataFactory,
    public deferFieldCalculation: boolean,
  ) {
    const {model, store: componentStore} = repeaterComponentData
    this.model = model
    this.componentStore = componentStore

    if (!model.valued) throw new Error(`'model.valued' is falsy`)
    if (!model.valueType) throw new Error(`'model.typeOfValue' is undefined`)
    this.valued = model.valued
    this.valueType = model.valueType

    const className = 'RepeaterField'

    makeAutoObservable(this, {
      model: false,
      dataValidator: observable.ref
    }, {name: nameObservable(className, {key: componentStore.key}), autoBind: true})

    // first, we initialize the value
    this.initialData = this.isComputed ? this.computedValue : this.initialDataValue

    this.#disposers = [
      autorun(
        () => {
          this.dataValidator = this.createDataValidator(
            repeaterComponentData,
            this.valueType,
            error => this.error = error
          )
        }
        , {name: nameAutorun(className, 'setValidator', {key: componentStore.key})}),
    ]

    // then, sign up for data changes, this could be:
    // 1. changing the form data.
    // 2. automatic recalculation of the value if the property is computable.
    // 3. if the data change has occurred, we save the value in the field.
    this.#dataReactionDisposer = this.createDataChangeReaction()
  }

  /**
   * @inheritDoc
   */
  get fieldType(): FieldType {
    return 'repeater'
  }

  /**
   * @inheritDoc
   */
  init() {
    this.deferFieldCalculation = false

    if (this.isComputed) {
      // we set the value asynchronously to prevent loops in MobX
      setTimeout(() => {
        this.initialData = this.computedValue
        this.initFields(this.componentData)
      }, 0)
      return
    }

    this.initialData = this.initialDataValue
    this.initFields(this.componentData)
  }

  /**
   * @returns the initial value for the field.
   */
  get initialValue() {
    return this.componentStore.props[this.valued]?.value ?? this.modelValue
  }

  /**
   * @returns the default value for the field from {@link Model}.
   */
  get modelValue() {
    return this.model.defaultProps?.[this.valued]
  }

  /**
   * @inheritDoc
   */
  dispose() {
    this.#disposers.forEach(dispose => dispose())
    this.disableReaction()
    this.disposeOldComponentDatas()
  }

  /**
   * @inheritDoc
   */
  get value() {
    return this.componentData.map(cd => cd.generatedData())
  }

  /**
   * @inheritDoc
   */
  setValue(value: unknown) {
    if (isNull(value) || isUndefined(value) || Array.isArray(value)) {
      this.initialData = value
      return
    }
    // todo implement, autoValidate is not working correctly
    // if (this.componentStore.schema?.autoValidate !== false) {
    //   this.dataValidator?.sendValidationEvent?.(this.value)
    // }
  }

  /**
   * @inheritDoc
   */
  setTouched() {
    this.touched = true
  }

  /**
   * @inheritDoc
   */
  async validate() {
    if (!this.needValidate) {
      this.clearError()
      return
    }
    const promises = this.componentData.map(cd => cd.validate())
    await Promise.allSettled(promises)
    await this.dataValidator?.validate?.(this.value)
  }

  /**
   * @inheritDoc
   */
  async getValidationResult() {
    if (!this.needValidate) return
    const result: ValidationMessages[] = []
    for (let i = 0; i < this.componentData.length; i++) {
      const cd = this.componentData[i]
      const messages = await cd.getValidationResult()
      result.push(messages)
    }
    return result
    // await this.dataValidator?.getValidationResult?.(this.value)
    // return this.getRepeaterError(result)
    // return {
    //   [this.componentStore.key]: result,
    //   [this.errorFieldName]: this.error
    // }
  }

  /**
   * @inheritDoc
   */
  reset() {
    this.setValue(this.initialValue)
    this.componentData.forEach(cd => {
      cd.allFields.forEach(field => field.reset())
    })
    this.clearError()
  }

  /**
   * @inheritDoc
   */
  clear() {
    this.setValue(this.modelValue)
    this.touched = false
    this.clearError()
  }

  /**
   * @returns true if the field should be validated, false otherwise.
   */
  get needValidate() {
    return needRender(this.componentStore, this.repeaterComponentData.dataRoot)
  }

  /**
   * Clears the error message for this field.
   */
  clearError() {
    this.error = undefined
    this.componentData.forEach(cd => {
      cd.allFields.forEach(field => field.setError(undefined))
    })
  }

  /**
   * @inheritDoc
   */
  get errors() {
    let hasErrors = false
    const result: Array<Record<string, unknown>> = []
    this.componentData.forEach(cd => {
      result.push(cd.errors)
      hasErrors = hasErrors || cd.hasErrors
    })
    if (!hasErrors) return
    return result
  }

  /**
   * @inheritDoc
   */
  setError = (error: unknown) => {
    if (isUndefined(error) || isNull(error)) {
      this.clearError()
      return
    }

    if (!isRecord(error)) throw new Error(`Expected 'object' type, got '${typeof error}'`)

    this.error = error[this.errorFieldName] as string

    const itemErrors = error as unknown as Array<Record<string, unknown>>
    this.componentData.forEach((cd, index) => {
      const item = itemErrors?.[index]
      cd.allComponentFields.forEach(({field, dataKey}) => field.setError(item?.[dataKey]))
    })
  }

  /**
   * @returns the component settings for the RepeaterItem component.
   */
  get repeaterItemStore() {
    const componentStore = JSON.parse(JSON.stringify(this.componentStore))
    const repeaterItem = new ComponentStore(this.componentStore.key, 'RepeaterItem')
    repeaterItem.type = 'RepeaterItem'
    repeaterItem.children = componentStore.children
    repeaterItem.renderWhen = componentStore.props?.itemRenderWhen
    return repeaterItem
  }

  /**
   * @returns the number of elements in the repeater.
   */
  get itemsCount() {
    if (!this.initialData || !Array.isArray(this.initialData)) return 0
    return this.initialData.length
  }

  /**
   * @inheritDoc
   */
  get componentData(): ComponentData[] {
    // read memoized values before performing an action
    const itemsCount = this.itemsCount
    const originalStore = this.repeaterItemStore
    const repeaterKey = this.componentStore.key
    const repeaterDataKey = dataKey(this.componentStore)
    const repeaterDataRoot = this.repeaterComponentData.dataRoot

    return runInAction(() => {
      const result: ComponentData[] = []
      for (let i = 0; i < itemsCount; i++) {
        // first, create an element that will be the parent for the context
        const contextStore = new ComponentStore(`${repeaterKey}-context-item-${i}`, 'Fragment')
        // save the repeater key for use in repeater actions (addRow, removeRow)
        contextStore.props = {repeaterDataKey: {value: repeaterDataKey}}
        const contextData = this.componentDataFactory.createComponentData(contextStore, false)
        contextData.index = i
        contextData.parent = repeaterDataRoot
        contextData.dataRootProvider = {
          get dataRoot() {
            return contextData
          }
        }

        contextData.getInitialData = () => {
          const initialData = this.initialData
          if (Array.isArray(initialData)) return initialData[i]
        }
        contextData.setInitialData = (key, value) => {
          const initialData = this.initialData
          const array: Array<Record<string, unknown>> = Array.isArray(initialData) ? [...initialData] : []

          const item = mergeData(contextData.generatedData(), array[i])
          item[key] = value
          array[i] = item

          this.setInitialData(array)
        }

        // now create the root element of the inner form, it is necessary for correct work of itemRenderWhen property
        const rootStore = new ComponentStore(`${repeaterKey}-root-item-${i}`, 'Fragment')
        const rootData = this.componentDataFactory.createComponentData(rootStore, false)
        rootData.setParent(contextData)

        // finally create a repeater element
        const cs = ComponentStore.createFromObject(originalStore)
        cs.key = `${repeaterKey}-item-${i}`
        const repeaterItem = this.componentDataFactory.createComponentData(cs, true)
        repeaterItem.setParent(rootData)

        result.push(contextData)
      }
      this.disposeOldComponentDatas()
      this.#oldComponentDatas = result
      if (!this.deferFieldCalculation) this.initFields(result)
      return result
    })
  }

  /**
   * @returns the initial data value for the field.
   */
  get initialDataValue() {
    return this.getInitialData() ?? this.initialValue
  }

  /**
   * @returns the computed value for the field.
   */
  get computedValue() {
    // to calculate the value of a calculated field,
    // we need the form data, i.e., in particular the value from this SimpleField (value).
    if (this.deferFieldCalculation) return this.initialDataValue
    const [, value] = this.calculateValue(this.componentStore, this.valued)
    return value
  }

  /**
   * @returns true if the field value is calculated, otherwise false.
   */
  get isComputed() {
    return isComputedProperty(this.componentStore.props[this.valued])
  }

  private initFields(components: ComponentData[]) {
    components.map(cd => {
      cd.allFields.forEach(field => field.init())
    })
  }

  private get errorFieldName() {
    return `${dataKey(this.componentStore)}Error`
  }

  private disposeOldComponentDatas() {
    this.#oldComponentDatas.forEach(componentData => {
      componentData.dispose()
    })
  }

  /**
   * @inheritDoc
   */
  disableReaction() {
    this.#dataReactionDisposer?.()
  }

  /**
   * @inheritDoc
   */
  enableReaction() {
    this.#dataReactionDisposer = this.createDataChangeReaction()
  }

  private createDataChangeReaction() {
    return reaction(() => ({
      isComputed: this.isComputed,
      computedValue: this.computedValue,
      initialDataValue: this.initialDataValue
    }), (data) => {
      this.initialData = data.isComputed ? data.computedValue : data.initialDataValue
    }, {name: nameObservable('RepeaterField', {key: this.componentStore.key})})
  }
}
