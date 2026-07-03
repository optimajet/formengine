import {execSync} from 'node:child_process'

/**
 * Runs a shell command in a directory with inherited stdio and a log line.
 * @param command command string
 * @param cwd working directory
 */
export function runCommandInDir(command: string, cwd: string): void {
  console.log(`▶ ${command} (cwd=${cwd})`)
  execSync(command, {cwd, stdio: 'inherit'})
}

/**
 * Opens a file with the OS default handler (browser, viewer, etc.).
 * @param filePath absolute or relative file path
 */
export function openFileInOs(filePath: string): void {
  const platform = process.platform

  if (platform === 'win32') {
    execSync(`start "" ${JSON.stringify(filePath)}`, {stdio: 'ignore'})
  } else if (platform === 'darwin') {
    execSync(`open ${JSON.stringify(filePath)}`, {stdio: 'ignore'})
  } else {
    execSync(`xdg-open ${JSON.stringify(filePath)}`, {stdio: 'ignore'})
  }
}
