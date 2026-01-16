import type {ComponentStore} from '../../stores/ComponentStore'
import type {ActionDefinition, ActionEventHandler, DefineActionHelper, EventName} from '../event'

export const iconsList = [
  'Breadcrumb',
  'Button',
  'Card',
  'Checkbox',
  'CollectionEditor',
  'Container',
  'Content',
  'CustomBlock',
  'CustomControl',
  'DatePicker',
  'Default',
  'Dropdown',
  'Dropzone',
  'ErrorMessage',
  'Grid',
  'GridLayout',
  'GridView',
  'Image',
  'Input',
  'Label',
  'Link',
  'Footer',
  'Header',
  'Sidebar',
  'Menu',
  'Message',
  'NumberFormat',
  'PatternFormat',
  'ProgressCircle',
  'ProgressLine',
  'RadioGroup',
  'Repeater',
  'RichTextEditor',
  'Search',
  'Signature',
  'Sparks',
  'StaticContent',
  'Tab',
  'TextArea',
  'TimePicker',
  'Toggle',
  'Tooltip',
  'TreePicker',
  'Uploader'
] as const

/**
 * The name of the icon for a form builder component.
 */
export type FormBuilderComponentIconName = typeof iconsList[number]

/**
 * The type of function that initializes an actions on a component. **Internal use only.**
 * @param props the component's property settings.
 * @param def the helper to create an action event handler.
 * @returns the Record with action event handlers.
 */
export type ActionsInitializer = (props: ComponentStore['props'], def: DefineActionHelper) => Record<EventName, ActionEventHandler | ActionDefinition>

/**
 * The component kind type.
 */
export type ComponentKind = 'container' | 'component' | 'template' | 'repeater'
