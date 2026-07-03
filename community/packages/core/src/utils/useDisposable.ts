import {useEffect, useState} from 'react'

/**
 * Type of disposable object.
 */
export type IDisposable = {
  /**
   * Performs the tasks necessary to release resources correctly.
   */
  dispose: () => void
}

/**
 * Creates a disposable object and dispose the object when the React component is unmounted. **Internal use only.**
 * @param factory the factory function to create a disposable object.
 * @returns the disposable object.
 */
export function useDisposable<T extends IDisposable>(factory: () => T): T | undefined {
  const [state, setState] = useState<T>()

  useEffect(() => {
    const disposable = factory()
    setState(disposable)
    return () => disposable.dispose()
    // the dispose function should only be called when a component is unmounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
