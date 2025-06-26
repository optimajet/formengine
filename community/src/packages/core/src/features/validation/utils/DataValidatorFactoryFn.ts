import type {Setter} from '../../../types'
import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'
import type {SchemaType} from '../types/SchemaType'
import type {DataValidator} from './DataValidator'

/**
 * Creates a data validator for the field.
 * @param componentData the component data.
 * @param valueType the field's data type.
 * @param onError the callback function called when the validation error text is set.
 * @returns the data validator.
 */
export type DataValidatorFactoryFn = (componentData: ComponentData,
                                      valueType: SchemaType,
                                      onError: Setter<string | undefined>) => DataValidator
