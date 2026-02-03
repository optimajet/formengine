/**
 * Performance calculation constants.
 * These constants are used to estimate web performance metrics based on bundle sizes.
 */

/**
 * JavaScript parse time per KB.
 * Estimated time to parse 1 KB of JavaScript code.
 * Unit: milliseconds per KB
 */
export const JS_PARSE_TIME_PER_KB = 1.5

/**
 * CSS parse time per KB.
 * Estimated time to parse 1 KB of CSS code.
 * CSS parsing is faster than JavaScript parsing.
 * Unit: milliseconds per KB
 */
export const CSS_PARSE_TIME_PER_KB = 0.5

/**
 * Baseline time for initial render.
 * This represents the time needed for initial DOM construction and first paint,
 * independent of bundle size.
 * Unit: milliseconds
 */
export const BASELINE_INITIAL_RENDER_MS = 50

/**
 * Slow 3G connection speed.
 * Represents a slow 3G network connection.
 * Unit: bytes per second
 */
export const SLOW_3G_SPEED_BPS = 51200 // 50 KB/s = 400 Kbps

/**
 * Average 4G connection speed.
 * Represents an average 4G network connection.
 * Unit: bytes per second
 */
export const AVERAGE_4G_SPEED_BPS = 512000 // 500 KB/s = 4 Mbps
