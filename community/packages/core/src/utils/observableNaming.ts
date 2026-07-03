function nameObservableEntity(observableName: string, owner: string, name?: string, params: Record<string, any> = {}) {
  const paramsString = Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('_')
  return `${observableName}_${owner}_${name ? `${name}_` : ''}${paramsString}`
}

/**
 * Computes the autorun name based on the owner, name, and parameters. **Internal use only.**
 * @param owner the owner of the autorun.
 * @param name the name of the autorun.
 * @param params the parameters for specific autorun.
 * @returns the computed autorun name.
 */
export function nameAutorun(owner: string, name: string, params: Record<string, any> = {}) {
  return nameObservableEntity('autorun', owner, name, params)
}

/**
 * Computes the observable name based on the owner, name, and parameters. **Internal use only.**
 * @param owner the owner of the observable.
 * @param params the parameters for specific observable.
 * @returns the computed observable name.
 */
export function nameObservable(owner: string, params: Record<string, any> = {}) {
  return nameObservableEntity('observable', owner, undefined, params)
}
