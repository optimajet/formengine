import type {CSSObject} from '@emotion/serialize'
import type {ComponentType, ReactNode} from 'react'
import {ComponentStore} from '../../../stores/ComponentStore'
import {commonStyles, getDefault, getDefaultCss} from '../../annotation'
import {toArray} from '../../annotation/toArray'
import {toStyleProperties} from '../../annotation/toStyleProperties'
import type {Annotations} from '../../annotation/utils/builders/Annotations'
import type {ActionEventHandler, EventName} from '../../event'
import {modules} from '../constants'
import type {ActionsInitializer, ComponentKind} from '../types'
import type {BuilderComponent} from './BuilderComponent'
import type {ComponentFeatures} from './ComponentFeature'
import {addOrUpdateFeature} from './ComponentFeature'
import type {ComponentMetadataEventListeners} from './ComponentMetadataEventListeners'
import type {ComponentPropertyBindType} from './ComponentPropertyBindType'
import type {ComponentRole} from './ComponentRole'
import type {InsertRestrictionFn} from './InsertRestrictionFn'
import {
  cfComponentIsPreset,
  cfComponentRole,
  cfDisableActionEditors,
  cfDisableComponentRemove,
  cfDisableStyles,
  cfDisableStylesForClassNameEditor,
  cfDisableTooltipProperties,
  cfDisableWrapperStyles,
  cfEnableInlineStylesEditor,
  cfEventHandlers,
  cfHideFromComponentPalette,
  cfSkipChildrenDuringFieldCollection
} from './integratedComponentFeatures'
import {Meta} from './Meta'
import {Model} from './Model'

/**
 * Definer class data.
 * @template T React component property type.
 */
export type DefinerData<T extends object> = {
  /**
   * The React component.
   */
  readonly component: ComponentType<T>,
  /**
   * The component name.
   */
  name?: string,
  /**
   * The component kind.
   */
  kind?: ComponentKind,
  /**
   * The set of component features.
   */
  features?: ComponentFeatures
  /**
   * The component category.
   */
  category?: string,
  /**
   * The CSS metadata.
   */
  cssObject?: Annotations<CSSObject>,
  /**
   * The component icon.
   */
  icon?: ComponentType,
  /**
   * The function that initializes an actions on a component (for internal use only).
   */
  readonly actionsInitializer?: ActionsInitializer,
  /**
   * The property metadata.
   */
  properties?: Annotations<T>,
  /**
   * @deprecated
   * The custom component to display in the component list (unused).
   */
  customPreview?: ReactNode,
  /**
   * The JSON source for the component (instance of {@link ComponentStore} class serialised to JSON).
   */
  initialJson?: string
  /**
   * The component metadata event listeners.
   */
  eventListeners?: ComponentMetadataEventListeners
  /**
   * The function that restricts the insertion of a component into another component.
   */
  insertRestriction?: InsertRestrictionFn
}

/**
 * The builder class to define the metadata of the form builder component.
 * @template T React component property type.
 */
export class Definer<T extends object> {
  /**
   * Definer class data.
   * @template T React component property type.
   */
  data: DefinerData<T>

  /**
   * Static method to create an instance of the component's metadata builder class.
   * @param component the React component.
   * @param displayName the display name for the anonymous component.
   * @returns the instance of the {@link Definer} class.
   */
  static define<T extends object>(component: ComponentType<T>, displayName?: string) {
    const name = displayName ?? component.displayName ?? component.name
    if (!name) throw Error('Anonymous components are not allowed!')
    const definer = new Definer<T>(component)
    if (displayName) definer.type(displayName)
    return definer
  }

  /**
   * Static method to create an instance of the preset component's metadata builder class.
   * @param name the preset name.
   * @param components the components of the preset.
   * @returns the instance of the {@link Definer} class.
   */
  static definePreset(name: string, components: ComponentStore[]) {
    if (!name) throw Error('Anonymous components are not allowed!')
    const PresetComponent = () => null
    const definer = new Definer(PresetComponent)
      .addFeature(cfComponentIsPreset, true)
      .type(name)
      .name(name)

    const source = new ComponentStore('', name)
    source.children = components
    return definer.initialJson(JSON.stringify(source))
  }

  private constructor(component: ComponentType<T>) {
    this.data = {component}
  }

  /**
   * Sets the name of the component.
   * @param name the component name.
   * @returns the modified Definer class instance.
   */
  name = (name: string) => this.#updateWith({name})

  /**
   * Sets the kind of the component.
   * @param kind the component kind.
   * @returns the modified Definer class instance.
   */
  kind = (kind: ComponentKind) => this.#updateWith({kind})

  /*
   * Sets the component features that provide additional information about component's characteristic. **Internal use only.**
   * @param name the feature name.
   * @param value the feature value.
   * @returns the modified Definer class instance.
   */
  addFeature = (name: string, value: unknown) => {
    const item = addOrUpdateFeature(this.data.features ?? {}, name, value)
    return this.#updateWith({features: item})
  }

  /**
   * Sets the icon of the component.
   * @param icon the component icon.
   * @returns the modified Definer class instance.
   */
  icon = (icon: ComponentType) => this.#updateWith({icon})

  /**
   * Sets the category of the component.
   * @param category the component category.
   * @returns the modified Definer class instance.
   */
  category = (category: string) => this.#updateWith({category})

  /**
   * Sets the type of the component.
   * @param type the component type.
   * @returns the modified Definer class instance.
   */
  type = (type: string) => {
    this.data.component.displayName = type
    return this
  }

  /**
   * Sets the metadata of the component's properties.
   * @param properties the metadata of the component's properties.
   * @returns the modified Definer class instance.
   */
  props = (properties: Annotations<T>) => this.#updateWith({properties})

  /**
   * Sets the component CSS metadata.
   * @param css the component CSS metadata.
   * @returns the modified Definer class instance.
   */
  css = (css: Annotations<CSSObject>): Definer<T> => this.#updateWith({cssObject: css})

  /**
   * Adds the metadata of the component's actions. **Internal use only.**
   * @param fn the function that initializes an actions on a component.
   * @returns the modified Definer class instance.
   */
  actions = (fn: ActionsInitializer) => this.#updateWith({actionsInitializer: fn})

  /**
   * @deprecated
   * Adds the custom component to be displayed in the component list. **Internal use only.**
   * @param customPreview the custom component.
   * @returns the modified Definer class instance.
   */
  preview = (customPreview: ReactNode) => this.#updateWith({customPreview})

  /**
   * @returns the component type name.
   */
  getType(): string {
    return this.data.component.displayName || this.data.component.name
  }

  /**
   * Sets initial component JSON.
   * @param initialJson the JSON source for the component (instance of {@link ComponentStore} class serialised to JSON).
   * @returns the modified Definer class instance.
   */
  initialJson = (initialJson?: string) => this.#updateWith({initialJson})

  /**
   * Sets the component metadata event listeners.
   * @param eventListeners the component metadata event listeners.
   * @returns the modified Definer class instance.
   */
  eventListeners = (eventListeners?: ComponentMetadataEventListeners) => this.#updateWith({eventListeners})

  /**
   * Sets the function that restricts the insertion of a component into another component.
   * @param insertRestriction the function that restricts the insertion of a component into another component.
   * @returns the modified Definer class instance.
   */
  insertRestriction = (insertRestriction?: InsertRestrictionFn) => {
    return this.#updateWith({insertRestriction})
  }

  /**
   * Sets the role (e.g., label, tooltip, etc.) for the component.
   * @param value the component role.
   * @returns the modified Definer class instance.
   */
  componentRole(value: ComponentRole) {
    return this.addFeature(cfComponentRole, value)
  }

  /**
   * Hides a component from the component palette.
   * @param value true to hide the component, false otherwise.
   * @returns the modified Definer class instance.
   */
  hideFromComponentPalette(value = true) {
    return this.addFeature(cfHideFromComponentPalette, value)
  }

  /**
   * Prevent this component from being removed.
   * @param value true to disable removal, false otherwise.
   * @returns the modified Definer class instance.
   */
  disableRemove(value = true) {
    return this.addFeature(cfDisableComponentRemove, value)
  }

  /**
   * Disables the styling of the component.
   * @param value true to disable the styling of the component.
   * @returns the modified Definer class instance.
   */
  withoutStyles(value = true) {
    return this.addFeature(cfDisableStyles, value)
  }

  /**
   * Disables the styling of the component wrapper.
   * @param value true to disable the styling of the component wrapper.
   * @returns the modified Definer class instance.
   */
  withoutWrapperStyles(value = true) {
    return this.addFeature(cfDisableWrapperStyles, value)
  }

  /**
   * Show or hide 'Styles for className' editor.
   * @param value if the value is `true` or `undefined`, the editor will be displayed.
   * @returns the modified Definer class instance.
   */
  showClassNameStylesEditor(value: boolean) {
    return this.addFeature(cfDisableStylesForClassNameEditor, !value)
  }

  /**
   * Show or hide 'Inline styles' properties editor.
   * @param value if the value is `true` or `undefined`, the editor will be displayed.
   * @returns the modified Definer class instance.
   */
  showInlineStylesEditor(value: boolean) {
    return this.addFeature(cfEnableInlineStylesEditor, value)
  }

  /**
   * Hides child components from the field collection.
   * It is used when components are dynamically added to the form, for example in the Repeater component.
   * @param value true if the feature is enabled.
   * @returns the modified Definer class instance.
   */
  skipChildrenDuringFieldCollection(value = true) {
    return this.addFeature(cfSkipChildrenDuringFieldCollection, value)
  }

  /**
   * Show or hide 'Tooltip' properties editor.
   * @param value if the value is `false` or `undefined`, the editor will be displayed.
   * @returns the modified Definer class instance.
   */
  hideTooltipEditor(value = true) {
    return this.addFeature(cfDisableTooltipProperties, value)
  }

  /**
   * Overrides event handlers (for example, onChange, onBlur) that are added to the component.
   * @param eventHandlers the custom event handlers.
   * @returns the modified instance of the builder.
   */
  overrideEventHandlers(eventHandlers: Record<EventName, ActionEventHandler>) {
    return this.addFeature(cfEventHandlers, eventHandlers)
  }

  /**
   * Hides or shows the 'Actions' editors.
   * @param value if the value is true, the editors will be hidden.
   * @returns the modified Definer class instance.
   */
  hideActionEditors(value = true) {
    return this.addFeature(cfDisableActionEditors, value)
  }

  /**
   * Creates component metadata for the form builder and form viewer.
   * @returns component metadata for the form builder and form viewer.
   */
  build(): BuilderComponent {
    const propAns = toArray(this.data.properties)
    const cssAns = toStyleProperties(this.data.cssObject)
    const cssWrapperAns = toStyleProperties(commonStyles)
    const valuedAnnotations = propAns.filter(an => an.valued === true)
    const firstValuedAn = valuedAnnotations[0]
    if (valuedAnnotations.length > 1) {
      console.warn('Several annotations with the "valued" property were found.' +
        ' There should be only one "valued" property in the component description!' +
        ` The annotation with the key "${valuedAnnotations[0].key}" will be used.`)
    }
    const valuedAn = firstValuedAn ?? propAns.find(an => an.name === 'value')
    const readOnlyAn = propAns.find(an => an.readOnly)
    const disabledAn = propAns.find(an => an.disabled)
    const propsBindingTypes = propAns.reduce((props, an) => {
      if (an.bindingType) props[an.key] = an.bindingType
      return props
    }, {} as Record<string, ComponentPropertyBindType>)

    const model = new Model(
      this.data.component,
      this.data.name || this.getType(),
      this.data.actionsInitializer,
      valuedAn?.key,
      valuedAn?.type,
      getDefault(propAns),
      getDefaultCss(cssAns),
      getDefaultCss(cssWrapperAns),
      this.getType(),
      this.data.kind,
      readOnlyAn?.key,
      propsBindingTypes,
      valuedAn?.uncontrolledValue,
      disabledAn?.key,
      valuedAn?.dataBindingType,
      this.data.features,
    )

    const meta = new Meta(
      this.getType(),
      propAns,
      cssAns,
      cssWrapperAns,
      modules,
      this.data.customPreview,
      valuedAn,
      this.data.initialJson,
      this.data.eventListeners,
      this.data.icon,
      this.data.insertRestriction
    )

    return {model, meta, category: this.data.category} as const
  }

  /**
   * Modifies the component's metadata builder with custom options.
   * @param opts the custom options.
   * @returns the modified instance of the builder.
   */
  #updateWith(opts: Partial<DefinerData<T>>): Definer<T> {
    Object.assign(this.data, opts)
    return this
  }
}

export const define = Definer.define
export const definePreset = Definer.definePreset
