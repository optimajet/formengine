import type {FluentBundle} from '@fluent/bundle'
import {isString} from '../../../utils/isString'
import {isUndefined} from '../../../utils/tools'
import {globalDefaultLanguage} from '../default'
import type {LanguageFullCode} from '../language'
import {createFluentBundle} from './createFluentBundle'

/**
 * A fluent message value paired with the bundle it was resolved from.
 */
export interface ResolvedMessage {
  /** The message text. */
  message: string;
  /** The fluent bundle the message was resolved from. */
  bundle: FluentBundle;
}

/**
 * Returns true when the value is a non-empty string containing only whitespace.
 * @param value value to check.
 * @returns true when the value is whitespace-only and not empty.
 */
const isWhitespaceOnlyNonEmptyString = (value: unknown): value is string => {
  return isString(value) && value !== '' && value.trim() === ''
}

/**
 * Returns true when the localization map explicitly stores an empty string for the message id.
 * @param items localization key to fluent source map.
 * @param messageId fluent message id.
 * @returns true when the entry exists and is the empty string.
 */
const hasExplicitEmptyLocalization = (
  items: Record<string, unknown> | undefined,
  messageId: string,
): boolean => {
  return !!items
    && Object.prototype.hasOwnProperty.call(items, messageId)
    && isString(items[messageId])
    && items[messageId] === ''
}

/**
 * Builds a resolved empty-string message, preferring the given bundle for formatting context.
 * @param preferredBundle bundle to attach when present.
 * @param fallbackLocale locale used when no bundle is provided.
 * @returns empty message with bundle for downstream formatting.
 */
const resolvedEmptyMessage = (
  preferredBundle?: FluentBundle,
  fallbackLocale?: LanguageFullCode,
): ResolvedMessage => {
  return {
    message: '',
    bundle: preferredBundle ?? createFluentBundle(fallbackLocale ?? globalDefaultLanguage.fullCode),
  }
}

/**
 * Gets the message value from a fluent bundle.
 * @param bundle the fluent bundle to get the message from.
 * @param id the message id to retrieve.
 * @returns the message value or undefined if not found.
 */
const getFluentMessageValue = (bundle: FluentBundle, id: string): string | undefined => {
  const msg = bundle.getMessage(id)
  if (!msg) {
    return undefined
  }
  return (msg.value as string | null) ?? ''
}

/**
 * Retrieves a message from bundles with fallback support.
 * @param messageId the message id to retrieve.
 * @param formBundle the primary form bundle.
 * @param defaultBundle the fallback default bundle.
 * @param formItems the localization items for the requested language.
 * @param defaultItems the localization items for the default language.
 * @returns the message value or undefined if not found.
 */
export const getMessageWithFallback = (
  messageId: string,
  formBundle?: FluentBundle,
  defaultBundle?: FluentBundle,
  formItems?: Record<string, unknown>,
  defaultItems?: Record<string, unknown>,
): ResolvedMessage | undefined => {
  if (hasExplicitEmptyLocalization(formItems, messageId)) {
    return resolvedEmptyMessage(formBundle)
  }

  if (formBundle) {
    const fromRequestedLocale = getFluentMessageValue(formBundle, messageId)
    if (!isUndefined(fromRequestedLocale)) {
      return {message: fromRequestedLocale, bundle: formBundle}
    }
  }

  if (hasExplicitEmptyLocalization(defaultItems, messageId)) {
    return resolvedEmptyMessage(defaultBundle)
  }

  if (defaultBundle) {
    const fromDefaultLocale = getFluentMessageValue(defaultBundle, messageId)
    if (!isUndefined(fromDefaultLocale)) {
      return {message: fromDefaultLocale, bundle: defaultBundle}
    }
  }

  return undefined
}

/**
 * Formats a resolved fluent message when present, or continues the property fallback chain.
 * @param localizedMessage localized message and source bundle.
 * @param format formatted message text from fluent.
 * @param continueFallback callback for prop, model default, and component type fallbacks.
 * @returns the resolved property value.
 */
export const resolveLocalizedMessageValue = (
  localizedMessage: ResolvedMessage | undefined,
  format: (message: ResolvedMessage['message'], bundle: FluentBundle) => string | undefined,
  continueFallback: () => string | undefined,
): string | undefined => {
  if (localizedMessage) {
    const {message, bundle} = localizedMessage
    const result = format(message, bundle)
    const isWhitespaceOnlySource = isWhitespaceOnlyNonEmptyString(message)
    if (isWhitespaceOnlySource && result === '') {
      // Fluent trims whitespace-only messages. Use regular fallback chain for this case.
    } else {
      return result
    }
  }

  return continueFallback()
}
