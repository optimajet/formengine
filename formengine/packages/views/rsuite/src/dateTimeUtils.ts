import {format as formatDate} from 'date-fns'

/**
 * Checks whether the format is valid and returns it trimmed.
 * @param format the date format.
 * @returns the trimmed date format or undefined.
 */
export const toSafeFormat = (format?: string) => {
  const trimmed = format?.trim()
  if (!trimmed) return undefined

  try {
    // fixes RSuite issue v5.64.2, check on never version
    formatDate(new Date(), trimmed)
  } catch (e) {
    return undefined
  }

  return trimmed
}

/**
 * Checks whether the format is valid.
 * @param format the date format.
 * @returns true if the format is a valid, false otherwise.
 */
export const formatValidator = (format?: string) => {
  const trimmed = format?.trim()
  if (!trimmed) return true

  try {
    formatDate(new Date(), trimmed)
    return true
  } catch (e) {
    return false
  }
}
