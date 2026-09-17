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
  // No end-of-options marker here, unlike the push below: `-b` and `-B` take
  // their value positionally, so the next argument is consumed as the branch
  // name and never parsed as an option, even when it is a real one such as
  // `-q`. A dash-leading name then fails git's own ref format check instead of
  // changing what the command does.
  git(['checkout', reset ? '-B' : '-b', branch]);
}

export interface GitPushBranchOptions {
  force?: boolean;
}

export function gitPushBranch(
  branch: string,
  { force = false }: GitPushBranchOptions = {},
): void {
  // The branch is a trailing positional here rather than the value of an
  // option, so it does need `--` to end option parsing: without it,
  // `git push origin --mirror` pushes every ref rather than a branch of that
  // name.
  git(['push', ...(force ? ['--force'] : []), '-u', 'origin', '--', branch]);
}

export function gitHasChanges(): boolean {
  const output = git(['status', '--porcelain']);

  return output.trim().length > 0;
}
