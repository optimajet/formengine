/**
 * Generates the random string. **Internal use only.**
 * @returns the generated random string.
 */
export const getKey = () => {
  return (Math.random() * 1e18).toString(36).slice(0, 5).toUpperCase() + ''
}
