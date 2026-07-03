/**
 * Represents a function that validate the form data.
 * @param data the form data.
 * @returns the Record with form field errors.
 */
export type FormValidator = (data: Record<string, unknown>) => Promise<Record<string, string> | undefined>

/**
 * Represents an array of functions that validate the form data.
 */
export type FormValidators = FormValidator[]
