import type {BaseBuilder} from './BaseBuilder'

/**
 * The type-safe description of the component's metadata property builders.
 * @template T the component property name type.
 */
export type Annotations<T extends object> =
  {
    [key in keyof T]: BaseBuilder<T[key]> | undefined
  }
