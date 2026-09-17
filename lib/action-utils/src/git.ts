import { execFile } from './command';

function git(args: string[]): string {
  return execFile('git', args);
}

export function gitAdd(): void {
  git(['add', '.']);
}

export function gitCommit(
  message: string,
  authorName: string,
  authorEmail: string,
): void {
  git(['config', 'user.name', authorName]);
  git(['config', 'user.email', authorEmail]);
  git(['commit', '-m', message]);
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
  git(['checkout', reset ? '-B' : '-b', branch]);
}

export interface GitPushBranchOptions {
  force?: boolean;
}

export function gitPushBranch(
  branch: string,
  { force = false }: GitPushBranchOptions = {},
): void {
  // `--` keeps a branch name that begins with a dash from being read as an
  // option: `git push origin --mirror` pushes every ref rather than a branch.
  // `git checkout -B` needs no equivalent, and rejects such a name itself.
  git(['push', ...(force ? ['--force'] : []), '-u', 'origin', '--', branch]);
}

export function gitHasChanges(): boolean {
  const output = git(['status', '--porcelain']);

  return output.trim().length > 0;
}
