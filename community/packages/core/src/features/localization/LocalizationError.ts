/**
 * Localization error class.
 */
export class LocalizationError extends Error {
  /**
   * Creates a new LocalizationError.
   * @param name the error name.
   * @param message the error message.
   */
  constructor(name: string, message: string) {
    super(message)
    this.name = name
  }
}
