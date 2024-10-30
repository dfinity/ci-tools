import * as core from '@actions/core';
import * as github from '@actions/github';
import { getInput, gitHasChanges } from '@dfinity/action-utils';
import { createPullRequest } from './create-pull-request';
import { createCommit } from './create-commit';

export async function run(): Promise<void> {
  try {
    const authorName = getInput('author_name');
    const authorEmail = getInput('author_email');
    const head = getInput('branch_name');
    const base = getInput('base_branch_name');
    const message = getInput('commit_message');
    const title = getInput('pull_request_title');
    const body = getInput('pull_request_body');
    const token = getInput('token');

    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    if (!gitHasChanges()) {
      core.info(
        'No changes detected, skipping commit and pull request creation',
      );
      core.setOutput('pull_request_created', false);
      return;
    }

    createCommit({
      authorEmail,
      authorName,
      head,
      message,
    });

    const res = await createPullRequest({
      octokit,
      owner,
      repo,
      head,
      base,
      title,
      body,
    });

    core.setOutput('pull_request_number', res.number);
    core.setOutput('pull_request_created', true);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
