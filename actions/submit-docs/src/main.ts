import * as core from '@actions/core';
import * as github from '@actions/github';
import {
  getInput,
  getOptInput,
  gitAdd,
  gitCommit,
  gitHasChanges,
  gitPushBranch,
  inDir,
} from '@dfinity/action-utils';
import { createRepositoryDispatch } from './dispatch';

const DEFAULT_DESTINATION_REPO = 'dfinity/icp-js-sdk-docs';
const DEFAULT_EVENT_TYPE = 'submit-project-docs';

const DEFAULT_TARGET_BRANCH = 'icp-pages';

const GITHUB_ACTIONS_BOT_NAME = 'github-actions[bot]';
const GITHUB_ACTIONS_BOT_EMAIL =
  '41898282+github-actions[bot]@users.noreply.github.com';

type SubmitDocsActionPayload = {
  project_repository: string;
};

export async function run(): Promise<void> {
  try {
    const destinationRepo = getOptInput(
      'destination_repo',
      DEFAULT_DESTINATION_REPO,
    );
    const eventType = getOptInput('event_type', DEFAULT_EVENT_TYPE);
    const token = getInput('token');
    const targetDir = getInput('target_dir');
    const targetBranch = getOptInput('target_branch', DEFAULT_TARGET_BRANCH);

    inDir(targetDir, () => {
      if (gitHasChanges()) {
        gitAdd();
        gitCommit(
          `Update static assets`,
          GITHUB_ACTIONS_BOT_NAME,
          GITHUB_ACTIONS_BOT_EMAIL,
        );
        gitPushBranch(targetBranch);
      } else {
        core.info(`No changes to commit. Skipping push.`);
      }
    });

    const [destOwner, destRepo] = destinationRepo.split('/');
    if (!destOwner || !destRepo) {
      throw new Error(
        `Invalid destination repository format: ${destinationRepo}. Expected format: "owner/repo"`,
      );
    }

    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    const clientPayload: SubmitDocsActionPayload = {
      project_repository: `${owner}/${repo}`,
    };

    core.info(
      `Triggering repository_dispatch event on ${destinationRepo}. Event type: ${eventType}. Payload: ${JSON.stringify(
        clientPayload,
      )}`,
    );

    await createRepositoryDispatch({
      octokit,
      owner: destOwner,
      repo: destRepo,
      eventType,
      clientPayload,
    });

    core.info(
      `Successfully triggered pull-projects-docs workflow on ${destinationRepo}`,
    );
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
