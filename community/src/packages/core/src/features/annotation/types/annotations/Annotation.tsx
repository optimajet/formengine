import type {ReactNode} from 'react'
import type {ComponentPropertyBindType} from '../../../define/utils/ComponentPropertyBindType'
import type {DataBindingType} from '../../../define/utils/DataBindingType'
import type {RuleValidator, SchemaType} from '../../../validation'
import type {ErrorMap} from '../../../validation/ErrorMap'
import type {EditorType} from './EditorType'

/**
 * Basic metadata class for a React component property for the form builder.
 */
export class Annotation {

  /**
   * The component property key.
   */
  readonly key: string

  /**
   * The component property name.
   */
  readonly name: string

  /**
   * The name of the component's property editor.
   */
  readonly editor!: EditorType

  /**
   * The hint for the component property.
   */
  readonly hint?: ReactNode

  /**
   * True if the property value can be localized, false otherwise.
   */
  readonly localizable: boolean = false

  /**
   * True if the property value is bound to form data, false otherwise.
   */
  readonly valued: boolean = false

  /**
   * The type of component data binding.
   */
  readonly dataBindingType: DataBindingType = 'none'

  /**
   * True if the property value controls a read-only flag, false otherwise.
   */
  readonly readOnly: boolean = false

  /**
   * True if the property value controls a disabled flag, false otherwise.
   */
  readonly disabled: boolean = false

  /**
   * Additional properties for the component property editor.
   */
  readonly editorProps?: any

  /**
   * The default property value.
   */
  readonly default?: any

  /**
   * The property value for the uncontrolled state.
   */
  readonly uncontrolledValue?: unknown

  /**
   * The data type for the value of the property.
   */
  readonly type?: SchemaType

  /**
   * True if the component property is required, false otherwise.
   */
  readonly required: boolean = false

  /**
   * The function for validating the property value.
   */
  readonly validator?: RuleValidator

  /**
   * Message and/or error code for the validation function.
   */
  readonly errorMap?: ErrorMap

  /**
   * True if the property value can be a calculated property, false otherwise.
   */
  readonly calculable: boolean = true

  /**
   * A function that returns a string containing the source code of the function to bind child components.
   * @param props the properties of the component, which are available only inside Form Builder Designer.
   */
  readonly slotConditionBuilder?: (props: any) => string

  /**
   *  The component property binding type.
   */
  readonly bindingType?: ComponentPropertyBindType

  /**
   * Creates metadata for a React component property.
   * @param key the property name.
   * @param name the human-readable property name.
   */
  constructor(key: string, name: string) {
    this.key = key
    this.name = name
  }

  /**
   * @returns the metadata clone.
   */
  clone() {
    return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this))
  }
}
