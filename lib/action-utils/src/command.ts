import { execSync } from 'child_process';

export function exec(command: string): string {
  return execSync(command).toString();
}

const ALPHANUM = 'abcdefghijklmnopqrstuvwxyz0123456789';

export function generateRandomSuffix(length: number): string {
  let result = '';

  for (let i = 0; i < length; i++) {
    result += ALPHANUM.charAt(Math.floor(Math.random() * ALPHANUM.length));
  }

  return result;
}
