import {makeAutoObservable} from 'mobx'
import type {ComponentStore} from '../../../stores/ComponentStore'
import type {IStore} from '../../../stores/IStore'
import {nameObservable} from '../../../utils/observableNaming'
import {isUndefined} from '../../../utils/tools'
import type {Field} from './Field'
import type {FieldType} from './FieldType'
import {isStoreDataInParentForm} from './util'

/**
 * The field with the form data, contains the value of the nested form. **Internal use only.**
 */
export class TemplateField implements Field {

  /**
   * @inheritDoc
   */
  valued = ''

  /**
   * @inheritDoc
   */
  touched = false

  /**
   * Creates the nested form field with form data for the component.
   * @param componentStore the component settings.
   * @param viewerStore the form viewer settings.
   */
  constructor(
    readonly componentStore: ComponentStore,
    readonly viewerStore: IStore,
  ) {
    makeAutoObservable(this, undefined,
      {name: nameObservable('FormField', {key: componentStore.key}), autoBind: true})
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
  get storeDataInParentForm() {
    return isStoreDataInParentForm(this.componentStore)
  }

  /**
   * @inheritDoc
   */
  get value(): unknown {
    return this.form.generatedData()
  }

  /**
   * @inheritDoc
   */
  dispose() {
    this.viewerStore.dispose()
  }

  /**
   * @inheritDoc
   */
  clear(): void {
    this.form.clear()
    this.touched = false
  }

  /**
   * @inheritDoc
   */
  reset(): void {
    this.form.reset()
  }

  /**
   * @inheritDoc
   */
  setTouched(): void {
    this.touched = true
  }

  /**
   * @inheritDoc
   */
  setValue(value: unknown): void {
    if (!value) {
      this.form.reset()
      return
    }
    if (typeof value !== 'object') throw new Error(`Expected 'object' type, got '${typeof value}'`)

    const data: Record<string, any> = value
    this.form.allComponentFields.forEach(({field, dataKey}) => {
      const val = data[dataKey]
      // prevent uncontrolled value
      isUndefined(val) ? field.reset() : field.setValue(val)
    })
  }

  /**
   * @inheritDoc
   */
  async validate() {
    await this.form.validate()
  }

  /**
   * @inheritDoc
   */
  async getValidationResult() {
    return await this.form.getValidationResult()
  }

  /**
   * @inheritDoc
   */
  init() {
    this.form.allFields.forEach(field => field.init())
  }

  /**
   * @returns the form for the field.
   */
  get form() {
    return this.viewerStore.form.componentTree
  }

  /**
   * @inheritDoc
   */
  get errors() {
    return this.form.errors
  }

  /**
   * @inheritDoc
   */
  setError = (error: unknown) => {
    if (!error) return
    if (typeof error !== 'object') throw new Error(`Expected 'object' type, got '${typeof error}'`)
    const errorObject: Record<string, any> = error
    this.form.allComponentFields.forEach(({field, dataKey}) => {
      if (errorObject[dataKey]) return field.setError(errorObject[dataKey])
      if (field.storeDataInParentForm) return field.setError(errorObject)
    })
  }
}
