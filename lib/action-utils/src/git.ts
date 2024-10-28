import { exec } from './command';

export function gitAdd(): void {
  exec(`git add .`);
}

export function gitCommit(
  message: string,
  authorName: string,
  authorEmail: string,
): void {
  exec(`git commit -m "${message}" --author="${authorName} <${authorEmail}>"`);
}

export function gitCheckoutBranch(branch: string): void {
  exec(`git checkout -b ${branch}`);
}

export function gitHasChanges(): boolean {
  const output = exec('git status --porcelain');

  return output.trim().length > 0;
}
