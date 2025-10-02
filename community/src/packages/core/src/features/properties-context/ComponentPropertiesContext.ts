import type {ActionEventHandler, EventName} from '../event'
import type {CellInfo} from '../table/CellInfo'

/**
 * The React component property.
 */
export type ReactProperty = {
  /**
   * The value property name.
   */
  readonly propertyName: string
  /**
   * @returns the property value.
   */
  readonly propertyValue: unknown
}

/**
 * The component properties context type.
 */
export type ComponentPropertiesContext = {
  /**
   * The event handlers.
   */
  readonly eventHandlers?: Record<EventName, ActionEventHandler>

  /**
   * The value property.
   */
  readonly valueProperty?: ReactProperty

  /**
   * The information about the cell.
   */
  readonly cellInfo?: CellInfo
}
