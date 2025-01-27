import * as core from '@actions/core';
import {
  generateRandomSuffix,
  gitAdd,
  gitCheckoutBranch,
  gitCommit,
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
  const randomSuffix = generateRandomSuffix(6);
  const branchName = `${head}-${randomSuffix}`;

  gitCheckoutBranch(branchName);
  gitAdd();
  gitCommit(message, authorName, authorEmail);

  core.info(`Created git commit on branch ${branchName}`);
}
