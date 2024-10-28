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
