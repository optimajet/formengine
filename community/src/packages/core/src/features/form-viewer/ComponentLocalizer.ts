import type {ComponentStore} from '../../stores/ComponentStore'
import type {Language} from '../localization/types'

/**
 * The function to localize the properties of a component.
 * @param componentStore the component settings.
 * @param language the language selected in the form viewer.
 * @returns the Record with the localized properties of a component.
 */
export type ComponentLocalizer = (componentStore: ComponentStore, language: Language) => Record<string, any>
