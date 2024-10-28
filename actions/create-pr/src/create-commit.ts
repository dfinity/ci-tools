import * as core from '@actions/core';
import {
  generateRandomSuffix,
  gitAdd,
  gitCheckoutBranch,
  gitCommit,
  gitHasChanges,
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
  if (!gitHasChanges()) {
    throw new Error('No changes to commit');
  }

  const randomSuffix = generateRandomSuffix(6);
  const branchName = `${head}-${randomSuffix}`;

  gitCheckoutBranch(branchName);
  gitAdd();
  gitCommit(message, authorName, authorEmail);

  core.info(`Created git commit on branch ${branchName}`);
}
