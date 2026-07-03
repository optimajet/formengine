import os from 'node:os'

interface CpuScaledConcurrency {
  /** Total number of logical CPU cores. */
  cpus: number
  /** Safe concurrency limit derived from available CPU cores. */
  concurrency: number
}

/**
 * Returns a concurrency limit scaled to available CPU cores.
 * @param cpusPerTask number of CPU cores allocated per concurrent task
 * @returns CPU count and concurrency value of at least 1
 */
export function getCpuScaledConcurrency(cpusPerTask = 4): CpuScaledConcurrency {
  const cpus = os.cpus().length
  const concurrency = Math.max(1, Math.floor(cpus / cpusPerTask))

  return {cpus, concurrency}
}
