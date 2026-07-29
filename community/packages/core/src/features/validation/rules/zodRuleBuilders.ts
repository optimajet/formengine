import type {RuleValidator} from '../types/RuleValidator'
import {errorForUndefined} from './consts'
import type {ZodMiniType} from './zodMini'
import {z} from './zodMini'

export const stringScheme = z.string({error: errorForUndefined})
export const numberScheme = z.number({error: errorForUndefined})
export const booleanScheme = z.boolean({error: errorForUndefined})

/**
 * Zod Mini uses minLength, maxLength, and length for array size checks.
 * minSize, maxSize, and size do not validate array length.
 */
export const arrayScheme = z.array(z.unknown(), {error: errorForUndefined})

type ZodCheck = Parameters<ZodMiniType['check']>[0]

/**
 * Builds a {@link RuleValidator} from a Zod Mini schema with optional checks.
 * @param schema the Zod Mini schema.
 * @param checks optional Zod Mini checks to apply via {@link ZodMiniType.check}.
 * @returns the rule validator.
 */
export function toRuleValidator(schema: ZodMiniType, ...checks: ZodCheck[]): RuleValidator {
  const zodValidator = checks.length ? schema.check(...checks) : schema
  return async value => {
    const result = await zodValidator.safeParseAsync(value, {reportInput: true})
    if (result.success) return true

    const message = result.error.issues[0]?.message
    return message ?? false
  }
}

/**
 * Pipes the shared string scheme into a string-format schema.
 * @param formatSchema the downstream string schema.
 * @returns the piped schema.
 */
export function pipeStringScheme<B extends z.core.$ZodType<unknown, string>>(formatSchema: B) {
  return z.pipe(stringScheme, formatSchema)
}
