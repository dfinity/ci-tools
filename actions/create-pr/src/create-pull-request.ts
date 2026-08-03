import * as core from '@actions/core';
import { Octokit } from '@dfinity/action-utils';

export interface CreatePullRequestOptions {
  octokit: Octokit;
  owner: string;
  repo: string;
  head: string;
  base: string;
  title: string;
  body: string;
}

export interface CreatePullRequestResult {
  number: number;
}

export async function createPullRequest({
  octokit,
  owner,
  repo,
  head,
  base,
  title,
  body,
}: CreatePullRequestOptions): Promise<CreatePullRequestResult> {
  const res = await octokit.rest.pulls.create({
    owner,
    repo,
    title,
    head,
    base,
    body,
  });

  core.info(`Created pull request #${res.data.number}`);

  return {
    number: res.data.number,
  };
}

export interface FindOpenPullRequestOptions {
  octokit: Octokit;
  owner: string;
  repo: string;
  head: string;
  base: string;
}

/**
 * Finds the open pull request for the given head and base branches, if any.
 */
export async function findOpenPullRequest({
  octokit,
  owner,
  repo,
  head,
  base,
}: FindOpenPullRequestOptions): Promise<CreatePullRequestResult | undefined> {
  const res = await octokit.rest.pulls.list({
    owner,
    repo,
    base,
    head: `${owner}:${head}`,
    state: 'open',
  });

  const [pullRequest] = res.data;

  return pullRequest ? { number: pullRequest.number } : undefined;
}

export interface ClosePullRequestOptions {
  octokit: Octokit;
  owner: string;
  repo: string;
  number: number;
}

export async function closePullRequest({
  octokit,
  owner,
  repo,
  number,
}: ClosePullRequestOptions): Promise<void> {
  await octokit.rest.pulls.update({
    owner,
    repo,
    pull_number: number,
    state: 'closed',
  });

  core.info(`Closed pull request #${number}`);
}
