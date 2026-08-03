import { exec } from './command';

export function gitAdd(): void {
  exec(`git add .`);
}

export function gitCommit(
  message: string,
  authorName: string,
  authorEmail: string,
): void {
  exec(`git config user.name "${authorName}"`);
  exec(`git config user.email "${authorEmail}"`);
  exec(`git commit -m "${message}"`);
}

export interface GitCheckoutBranchOptions {
  /**
   * Reset the branch to the current commit if it already exists, instead of
   * failing. Required when reusing a long-lived branch.
   */
  reset?: boolean;
}

export function gitCheckoutBranch(
  branch: string,
  { reset = false }: GitCheckoutBranchOptions = {},
): void {
  exec(`git checkout ${reset ? '-B' : '-b'} ${branch}`);
}

export interface GitPushBranchOptions {
  force?: boolean;
}

export function gitPushBranch(
  branch: string,
  { force = false }: GitPushBranchOptions = {},
): void {
  exec(`git push ${force ? '--force ' : ''}-u origin ${branch}`);
}

export function gitHasChanges(): boolean {
  const output = exec('git status --porcelain');

  return output.trim().length > 0;
}
