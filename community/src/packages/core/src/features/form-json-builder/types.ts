import type {CSSProperties} from 'react'
import type {LanguageFullCode} from '../localization/types'

/**
 * Represents the target device for applying styles.
 */
export type Device = 'any' | 'desktop' | 'mobile' | 'tablet'

/**
 * Interface for building a form JSON.
 */
export interface IFormJsonBuilder {
  /**
   * Adds a component to the form.
   * @param key the unique identifier of the component.
   * @param type the type of the component.
   * @returns the component builder for further configuration.
   */
  component(key: string, type: string): IComponentBuilder

  /**
   * Serializes the current state of the form into a JSON string.
   * @returns JSON representation of the form.
   */
  json(): string
}

/**
 * Interface for configuring a specific component within the form.
 */
export interface IComponentBuilder extends IFormJsonBuilder {
  /**
   * Sets a property on the component.
   * @param key the name of the property.
   * @param value the value of the property.
   * @returns the component builder for method chaining.
   */
  prop(key: string, value: any): IComponentBuilder

  /**
   * Sets a localized property on the component.
   * @param key the name of the property.
   * @param language the localized code, e.g. 'en-US'.
   * @param value the localized value of the property.
   * @returns the component builder for method chaining.
   */
  localizedProp(key: string, language: LanguageFullCode, value: any): IComponentBuilder

  /**
   * Sets a computed property on the component.
   * @param key the name of the property.
   * @param value the code of the function for calculating the property value.
   * @returns the component builder for method chaining.
   */
  computedProp(key: string, value: string): IComponentBuilder

  /**
   * Starts configuring validation rules for the specified field.
   * @param key the name of the validation rule.
   * @returns the validation builder for defining arguments.
   */
  validation(key: string): IValidationBuilder

  /**
   * Starts configuring an event handler for the given event name.
   * @param eventName the name of the event (e.g., "onClick", "onChange").
   * @returns the event handler builder.
   */
  event(eventName: string): IEventHandlerBuilder

  /**
   * Applies styles to the component, optionally per device.
   * @param value the style string (e.g., "color: red") or object with style properties.
   * @param device the optional device-specific styling.
   * @returns the component builder for method chaining.
   */
  style(value: string | CSSProperties, device?: Device): IComponentBuilder

  /**
   * Adds child components inside this component.
   * @param childrenBuilder the function that builds the child components.
   * @returns the component builder for method chaining.
   */
  children(childrenBuilder: (builder: IFormJsonBuilder) => IFormJsonBuilder): IComponentBuilder
}

/**
 * Interface for defining validation rules for a component.
 */
export interface IValidationBuilder extends IComponentBuilder {
  /**
   * Specifies the arguments for the validation rule.
   * @param val the validation arguments.
   * @returns the component builder for method chaining.
   */
  args(val: any): IComponentBuilder
}

/**
 * Interface for defining event handlers for a component.
 */
export interface IEventHandlerBuilder extends IComponentBuilder {
  /**
   * Sets a common handler for the event.
   * @param name the name of the common handler.
   * @returns the event handler builder.
   */
  commonAction(name: string): IEventHandlerBuilder

  /**
   * Sets a custom handler for the event.
   * @param name the name of the custom handler function.
   * @returns the event handler builder.
   */
  customAction(name: string): IEventHandlerBuilder

  /**
   * Specifies the arguments passed to the event handler.
   * @param val the arguments to pass to the handler.
   * @returns the event handler builder.
   */
  args(val: any): IEventHandlerBuilder
}

/**
 * Options for configuring the form behavior.
 */
export type FormOptions = {
  /**
   * The type of component that displays validation errors.
   */
  errorType?: string
  /**
   * The default form language.
   */
  defaultLanguage?: string
}
