/**
 * Calculable result.
 */
export class CalculableResult {

  /**
   * Constructor.
   * @param error the error.
   * @param result the result.
   * @param exceptions the exceptions.
   * @param warning the warning.
   */
  constructor(readonly error = false, readonly result?: any, readonly exceptions?: Error[], readonly warning?: boolean) {
  }

  /**
   * Creates a new instance of the CalculableResult class with a successful result.
   * @param result the calculable result.
   * @returns the new instance of CalculableResult class.
   */
  static success(result: any) {
    return new CalculableResult(false, result)
  }

  /**
   * Creates a new instance of CalculableResult class with an error.
   * @param exceptions the exception array.
   * @returns the new instance of CalculableResult class.
   */
  static error(exceptions: Error[]) {
    return new CalculableResult(true, undefined, exceptions)
  }

  /**
   * Creates a new instance of the CalculableResult class with a warning result.
   * @param result the calculable result.
   * @returns the new instance of CalculableResult class.
   */
  static warning(result: any) {
    return new CalculableResult(false, result, undefined, true)
  }
}
