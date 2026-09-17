import { execFileSync, execSync } from 'child_process';

export function exec(command: string): string {
  return execSync(command).toString();
}

/**
 * Runs a command with its arguments passed straight to it rather than through a
 * shell, so that a value taken from an action input cannot be read as shell
 * syntax. Prefer this over `exec` for anything built from an input.
 */
export function execFile(file: string, args: string[]): string {
  return execFileSync(file, args).toString();
}

const ALPHANUM = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function generateRandomSuffix(length: number): string {
  let result = '';

  for (let i = 0; i < length; i++) {
    result += ALPHANUM.charAt(Math.floor(Math.random() * ALPHANUM.length));
  }

  return result;
}

export function inDir(dir: string, fn: () => void): void {
  const currentDir = process.cwd();
  process.chdir(dir);
  fn();
  process.chdir(currentDir);
}
