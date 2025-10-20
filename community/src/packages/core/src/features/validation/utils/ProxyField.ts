import {autorun, makeAutoObservable, observable} from 'mobx'
import type {ComponentStore} from '../../../stores/ComponentStore'
import type {Setter} from '../../../types'
import {nameAutorun, nameObservable} from '../../../utils/observableNaming'
import {isNull, isUndefined} from '../../../utils/tools'
import type {Model} from '../../define'
import type {SchemaType} from '../types/SchemaType'
import {autoConvertField} from './autoConvertField'
import type {DataValidator} from './DataValidator'
import type {Disposer} from './Disposer'
import type {Field} from './Field'
import type {FieldType} from './FieldType'

/**
 * Field with form data, contains only one value. **Internal use only.**
 */
export class ProxyField implements Field {

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

  /**
   * Creates the field with form data for the component.
   * @param getProxyValue the function for retrieving data.
   * @param setProxyValue the function for setting data.
   * @param createDataValidator the function to create a data validator.
   * @param componentStore the component settings.
   * @param model the component metadata for the form viewer.
   * @param deferFieldCalculation if true, then the calculated field must be explicitly initialized.
   */
  constructor(
    readonly getProxyValue: () => unknown,
    readonly setProxyValue: (value: unknown) => void,
    readonly createDataValidator: (valueType: SchemaType, onError: Setter<string | undefined>) => DataValidator,
    readonly componentStore: ComponentStore,
    readonly model: Model,
    public deferFieldCalculation: boolean,
  ) {
    if (!model.valued) throw new Error(`'model.valued' is falsy`)
    if (!model.valueType) throw new Error(`'model.typeOfValue' is undefined`)
    this.valued = model.valued
    this.valueType = model.valueType

    const className = 'ProxyField'

    makeAutoObservable(this, {
      model: false,
      dataValidator: observable.ref,
    }, {name: nameObservable(className, {key: componentStore.key}), autoBind: true})

    this.#disposers = [
      autorun(
        () => {
          this.dataValidator = this.createDataValidator(
            this.valueType,
            error => this.error = error
          )
        }
        , {name: nameAutorun(className, 'setValidator', {key: componentStore.key})}),
    ]
  }

  /**
   * @inheritDoc
   */
  get value(): unknown {
    return this.getProxyValue()
  }

  /**
   * @inheritDoc
   */
  get fieldType(): FieldType {
    return 'simple'
  }

  /**
   * @inheritDoc
   */
  init() {
    this.deferFieldCalculation = false
  }

  /**
   * @returns the initial value for the field.
   */
  get initialValue() {
    return this.componentStore.props[this.valued]?.value ?? this.defaultValue
  }

  /**
   * @returns the default value for the field.
   */
  get defaultValue() {
    return this.model.defaultProps?.[this.valued]
  }

  /**
   * @inheritDoc
   */
  dispose() {
    this.#disposers.forEach(dispose => dispose())
  }

  /**
   * @inheritDoc
   */
  setValue(value: unknown) {
    const converted = autoConvertField(value, this.valueType)
    this.setProxyValue(converted)
    if (!this.needValidate) {
      this.clearError()
      return
    }
    if (this.componentStore.schema?.autoValidate !== false) {
      this.dataValidator?.sendValidationEvent?.(this.value)
    }
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
    await this.dataValidator?.validate?.(this.value)
  }

  /**
   * @inheritDoc
   */
  async getValidationResult() {
    if (!this.needValidate) return
    return this.dataValidator?.getValidationResult?.(this.value)
  }

  /**
   * @inheritDoc
   */
  reset() {
    this.setProxyValue(this.initialValue ?? this.defaultValue)
    this.clearError()
  }

  /**
   * @inheritDoc
   */
  clear() {
    this.setProxyValue(this.defaultValue)
    this.touched = false
    this.clearError()
  }

  /**
   * @returns true if the field should be validated, false otherwise.
   */
  get needValidate() {
    // validation is disabled
    return false
  }

  /**
   * Clears the error message for this field.
   */
  clearError() {
    this.error = undefined
  }

  /**
   * Sets the error value.
   * @param error the error value to be set. If the error is `undefined` or `null`, the error value will be reset to `undefined`.
   * @throws {Error} throws an error if the provided value is not a string, undefined, or null.
   */
  setError = (error: unknown) => {
    if (typeof error === 'string') {
      this.error = error
    } else if (isUndefined(error) || isNull(error)) {
      this.error = undefined
    } else {
      throw new Error(`Expected 'string | undefined | null' type, got '${typeof error}'`)
    }
  }
}
