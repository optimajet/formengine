import type {Model} from '../define'
import type {ActionEventArgs, ActionEventHandler, EventName} from '../event'
import type {CellInfo} from '../table/CellInfo'
import type {Field} from '../validation'
import type {ComponentPropertiesContext, ReactProperty} from './ComponentPropertiesContext'
import {emptyPropertiesContext} from './emptyPropertiesContext'

/**
 * Returns the default event handlers to the field.
 * @param field the field.
 * @returns the default event handlers for the field.
 */
const getFieldEventHandlers = (field: Field): Record<EventName, ActionEventHandler> => {
  return {
    onChange: (e: ActionEventArgs) => {
      field.setValue(e.value)
    },
    onBlur: () => {
      field.setTouched()
    }
  }
}

const getValueProperty = (propertyName: string, field: Field, model: Model): ReactProperty => {
  return {
    propertyName,
    get propertyValue() {
      return field.value ?? model.uncontrolledValue
    }
  }
}

/**
 * Returns a default field's property context.
 * @param field the field.
 * @param model the component metadata.
 * @param cellInfo the information about the cell.
 * @returns a default field's property context.
 */
export const getFieldPropertiesContext = (field: Field, model: Model,
                                          cellInfo?: CellInfo): ComponentPropertiesContext => {
  if (!field || !model.valued) return emptyPropertiesContext

  const eventHandlers = getFieldEventHandlers(field)

  const valueProperty = model.kind !== 'template'
    ? getValueProperty(model.valued, field, model)
    : undefined

  return {
    eventHandlers,
    valueProperty,
    cellInfo
  }
}
