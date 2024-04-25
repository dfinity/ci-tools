import * as core from '@actions/core';
import { Octokit, Graphql } from '@dfinity/action-utils';

export interface EnableAutoMergeOptions {
  owner: string;
  repo: string;
  mergeMethod: string;
  pullRequestNumber: number;
  octokit: Octokit;
  graphql: Graphql;
}

export async function enableAutoMerge({
  octokit,
  graphql,
  owner,
  repo,
  mergeMethod,
  pullRequestNumber,
}: EnableAutoMergeOptions): Promise<void> {
  const { data: pullRequest } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullRequestNumber,
  });

  const pullRequestId = pullRequest.node_id;

  const query = `mutation EnablePullRequestAutoMerge($pullId: ID!, $mergeMethod: PullRequestMergeMethod) {
      enablePullRequestAutoMerge(input: {
        pullRequestId: "$pullRequestId,
        mergeMethod: $mergeMethod,
      }) {
          __typename
      }
  }`;

  await graphql<EnablePullRequestAutoMergeResponse>(query, {
    pullRequestId,
    mergeMethod,
  });

  core.info(`Automerge enabled for pull request #${pullRequestNumber}`);
}

interface EnablePullRequestAutoMergeResponse {
  enablePullRequestAutoMerge: {
    pullRequest: {
      autoMergeRequest: { enabledAt: Date };
    };
  };
}
