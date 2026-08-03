import * as core from '@actions/core';
import * as github from '@actions/github';
import {
  generateRandomSuffix,
  getInput,
  getOptInput,
  gitHasChanges,
} from '@dfinity/action-utils';
import {
  closePullRequest,
  createPullRequest,
  findOpenPullRequest,
} from './create-pull-request';
import { createCommit } from './create-commit';

export async function run(): Promise<void> {
  try {
    const authorName = getInput('author_name');
    const authorEmail = getInput('author_email');
    const reuseBranch = getOptInput('reuse_branch', 'false') === 'true';
    const branchName = getInput('branch_name');
    // A fresh branch per run leaves a pull request behind on every run where an
    // earlier one has not been merged yet. Reusing a single branch keeps one
    // self-updating pull request instead.
    const head = reuseBranch
      ? branchName
      : `${branchName}-${generateRandomSuffix(6)}`;
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
      core.setOutput('pull_request_updated', false);

      // There is nothing left to propose, so a pull request opened by an earlier
      // run is obsolete. Left open it goes stale and eventually conflicts.
      if (reuseBranch) {
        const obsolete = await findOpenPullRequest({
          octokit,
          owner,
          repo,
          head,
          base,
        });

        if (obsolete) {
          await closePullRequest({
            octokit,
            owner,
            repo,
            number: obsolete.number,
          });
          core.setOutput('pull_request_number', obsolete.number);
        }
      }

      return;
    }

    createCommit({
      authorEmail,
      authorName,
      head,
      message,
      reuseBranch,
    });

    // The force push above has already updated any open pull request for this
    // branch, so creating another one would fail.
    const existing = reuseBranch
      ? await findOpenPullRequest({ octokit, owner, repo, head, base })
      : undefined;

    if (existing) {
      core.info(`Updated pull request #${existing.number}`);
      core.setOutput('pull_request_number', existing.number);
      core.setOutput('pull_request_created', false);
      core.setOutput('pull_request_updated', true);

      return;
    }

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
    core.setOutput('pull_request_updated', false);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
