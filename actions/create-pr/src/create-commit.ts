import * as core from '@actions/core';
import {
  gitAdd,
  gitCheckoutBranch,
  gitCommit,
  gitPushBranch,
} from '@dfinity/action-utils';

export interface CreateCommitOptions {
  message: string;
  head: string;
  authorName: string;
  authorEmail: string;
  /**
   * Reuse a long-lived branch rather than a fresh one, resetting it to the
   * current commit and force pushing it.
   */
  reuseBranch?: boolean;
}

export function createCommit({
  message,
  head,
  authorName,
  authorEmail,
  reuseBranch = false,
}: CreateCommitOptions): void {
  gitCheckoutBranch(head, { reset: reuseBranch });
  gitAdd();
  gitCommit(message, authorName, authorEmail);
  gitPushBranch(head, { force: reuseBranch });

  core.info(`Created git commit on branch ${head}`);
}
