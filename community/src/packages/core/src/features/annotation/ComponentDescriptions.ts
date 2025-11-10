/**
 * The i18n item.
 */
export type I18nItem = {
  /**
   * The name of the item.
   */
  name?: string
  /**
   * The description of the item.
   */
  description?: string
}

/**
 * The description of a component.
 */
export type ComponentDescription = I18nItem & {
  /**
   * The properties of the component.
   */
  props?: Record<string, I18nItem>
}

/**
 * A component library description.
 */
export type ComponentLibraryDescription = {
  /**
   * A record mapping category names to their descriptions.
   */
  categories?: Record<string, I18nItem>
  /**
   * A record mapping component names to their descriptions.
   */
  components?: Record<string, ComponentDescription>
  /**
   * A record mapping common component properties to their descriptions.
   */
  commonProperties?: Record<string, I18nItem>
}
