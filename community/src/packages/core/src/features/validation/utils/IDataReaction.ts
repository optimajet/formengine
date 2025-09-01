/**
 * Interface for managing reactions to data changes.
 */
export interface IDataReaction {
  /**
   * Disables the reaction for data.
   */
  disableReaction: () => void
  /**
   * Enables the reaction for data.
   */
  enableReaction: () => void
}
