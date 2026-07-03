/**
 * Represents a synchronous event handler.
 * @template TSender the type of the event source.
 * @template TEventArgs the type of the event arguments.
 */
export type SyncEventHandler<TSender, TEventArgs> = (source: TSender, eventArgs: TEventArgs) => void

/**
 * Represents a synchronous event that can be subscribed to and invoked. **Internal use only.**
 * @template TSender the type of the object that raises the event.
 * @template TEventArgs the type of the event arguments.
 */
export class SyncEvent<TSender, TEventArgs> {
  private handlers: Array<SyncEventHandler<TSender, TEventArgs>> = []

  /**
   * Adds a handler to the list of subscribers.
   * @param handler the handler function to be added.
   */
  public subscribe(handler: SyncEventHandler<TSender, TEventArgs>): void {
    this.handlers.push(handler)
  }

  /**
   * Removes the specified event handler from the list of handlers.
   * @param handler the event handler to remove.
   */
  public unsubscribe(handler: SyncEventHandler<TSender, TEventArgs>): void {
    this.handlers = this.handlers.filter(h => h !== handler)
  }

  /**
   * Returns true if the object has subscribers, false otherwise.
   * @returns true if the object has handlers registered for events, otherwise returns false.
   */
  get isSubscribed(): boolean {
    return this.handlers.length > 0
  }

  /**
   * Invokes the event by calling all registered event handlers.
   * @param sender the sender of the event.
   * @param eventArgs the event arguments.
   */
  public invoke(sender: TSender, eventArgs: TEventArgs): void {
    // Duplicate the array to avoid side effects during iteration.
    [...this.handlers].forEach(handler => handler(sender, eventArgs))
  }

  /**
   * Dispose method to release all handlers.
   */
  public dispose() {
    this.handlers = []
  }
}
