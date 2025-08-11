import * as core from '@actions/core';
import * as github from '@actions/github';
import { getInput } from '@dfinity/action-utils';
import { createRepositoryDispatch } from './dispatch';

const DEFAULT_DESTINATION_REPO = 'dfinity/icp-js-sdk-docs';
const DEFAULT_EVENT_TYPE = 'submit-project-docs';
const DEFAULT_SOURCE_BRANCH = 'icp-pages';

type SubmitDocsActionPayload = {
  repository: string;
  branch: string;
};

export async function run(): Promise<void> {
  try {
    const destinationRepo =
      getInput('destination_repo') || DEFAULT_DESTINATION_REPO;
    const eventType = getInput('event_type') || DEFAULT_EVENT_TYPE;
    const token = getInput('token');

    const [destOwner, destRepo] = destinationRepo.split('/');
    if (!destOwner || !destRepo) {
      throw new Error(
        `Invalid destination repository format: ${destinationRepo}. Expected format: "owner/repo"`,
      );
    }

    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    const clientPayload: SubmitDocsActionPayload = {
      repository: `${owner}/${repo}`,
      branch: DEFAULT_SOURCE_BRANCH,
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
