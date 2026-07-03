import {forms} from '../../forms'

/**
 * Returns the form from json.
 * @param name the name of the form.
 * @returns the form.
 */
export function getFormFromJson(name?: string) {
  if (name && forms[name]) return forms[name]
  throw new Error(`Unable to load form '${name}'`)
}
