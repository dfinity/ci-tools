import * as core from '@actions/core';
import * as github from '@actions/github';
import { getInput, getNumberInput } from '@dfinity/action-utils';

import { approvePullRequest } from './approve-pull-request';
import { enableAutoMerge, MergeMethod } from './enable-auto-merge';

export async function run(): Promise<void> {
  try {
    const token = getInput('token');
    const mergeMethod = getMergeMethod();
    const pullRequestNumber = getNumberInput('pull_request_number');

    const octokit = github.getOctokit(token);
    const graphql = octokit.graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });

    const { owner, repo } = github.context.repo;

    await approvePullRequest({ octokit, owner, repo, pullRequestNumber });
    await enableAutoMerge({
      octokit,
      graphql,
      owner,
      repo,
      mergeMethod,
      pullRequestNumber,
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

function getMergeMethod(): MergeMethod {
  const mergeMethod = getInput('merge_method').toLowerCase();

  switch (mergeMethod) {
    case 'merge':
      return MergeMethod.Merge;
    case 'squash':
      return MergeMethod.Squash;
    case 'rebase':
      return MergeMethod.Rebase;
    default:
      throw new Error(
        `Invalid merge method: ${mergeMethod}. Supported values are "merge", "squash", and "rebase".`,
      );
  }
}
