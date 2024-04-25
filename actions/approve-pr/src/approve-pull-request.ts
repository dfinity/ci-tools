import * as core from '@actions/core';
import { Octokit } from '@dfinity/action-utils';

export interface ApprovePullRequestOptions {
  octokit: Octokit;
  owner: string;
  repo: string;
  pullRequestNumber: number;
}

export async function approvePullRequest({
  octokit,
  owner,
  repo,
  pullRequestNumber,
}: ApprovePullRequestOptions): Promise<void> {
  await octokit.rest.pulls.createReview({
    owner,
    repo,
    pull_number: pullRequestNumber,
    event: 'APPROVE',
  });

  core.info(`Approved pull request #${pullRequestNumber}`);
}
