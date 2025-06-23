/**
 * Describes the mapping of a value type name to a type.
 */
export type SchemaTypeMap = {
  /**
   * The string.
   */
  'string': string
  /**
   * The number.
   */
  'number': number
  /**
   * The boolean.
   */
  'boolean': boolean
  /**
   * The object.
   */
  'object': object
  /**
   * The array.
   */
  'array': any[]
  /**
   * The enumeration.
   */
  'enum': any
  /**
   * The date.
   */
  'date': Date
  /**
   * The time.
   */
  'time': string
}
