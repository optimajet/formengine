import type {FluentBundle, FluentVariable} from '@fluent/bundle'
import type {ComponentStore} from '../../../stores/ComponentStore'
import type {IForm} from '../../../stores/IForm'
import type {IFormData} from '../../../utils/IFormData'
import type {LanguageFullCode} from '../language'
import type {LocalizationType} from '../types'

/**
 * Fluent bundles and item maps prepared for a localization pass.
 */
export type LocalizationBundleSetup = {
  /** Fluent bundle for the form default language. */
  defaultBundle?: FluentBundle;
  /** Localization items for the form default language. */
  defaultItems?: Record<string, unknown>;
  /** Fluent bundle for the requested language. */
  formBundle?: FluentBundle;
  /** Localization items for the requested language. */
  formItems?: Record<string, unknown>;
}

/**
 * Shared context for resolving localized values of one component.
 */
export type ComponentLocalizationContext = LocalizationBundleSetup & {
  form: IForm;
  formData: IFormData;
  componentStore: ComponentStore;
  type: LocalizationType;
  requestedFullCode: LanguageFullCode;
  messageIdPrefix: string;
  getFluentData: () => Record<string, FluentVariable>;
}
