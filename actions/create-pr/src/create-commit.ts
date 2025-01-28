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
}

export function createCommit({
  message,
  head,
  authorName,
  authorEmail,
}: CreateCommitOptions): void {
  gitCheckoutBranch(head);
  gitAdd();
  gitCommit(message, authorName, authorEmail);
  gitPushBranch(head);

  core.info(`Created git commit on branch ${head}`);
}
