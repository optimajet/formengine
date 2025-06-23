/**
 * Represents a relationship attribute value used in HTML.
 */
export type Rel = 'stylesheet' | string

/**
 * Loads a resource into the document head asynchronously. **Internal use only.**
 * @param id the identifier of the resource.
 * @param href represents a URL to the resource.
 * @param rel the relationship of the resource to the document.
 * @returns the promise that resolves when the resource has been loaded successfully.
 */
export const loadResource = (id: string, href: string, rel: Rel) => {
  return new Promise<void>((resolve, reject) => {
    if (document.getElementById(id)) return resolve()

    const link = document.createElement('link')
    link.id = id
    link.rel = rel
    link.href = href
    link.onload = () => {
      resolve()
    }
    link.onerror = reject

    document.head.appendChild(link)
  })
}

/**
 * Unloads a resource from the DOM based on its ID. **Internal use only.**
 * @param id the ID of the resource to unload.
 */
export const unloadResource = (id: string) => {
  const link = document.getElementById(id)
  link?.parentNode?.removeChild(link)
}
