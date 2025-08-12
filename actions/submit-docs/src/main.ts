import * as core from '@actions/core';
import * as github from '@actions/github';
import { getInput } from '@dfinity/action-utils';
import { createRepositoryDispatch } from './dispatch';

const DEFAULT_DESTINATION_REPO = 'dfinity/icp-js-sdk-docs';
const DEFAULT_EVENT_TYPE = 'submit-project-docs';

type SubmitDocsActionPayload = {
  project_repository: string;
};

export async function run(): Promise<void> {
  try {
    const destinationRepo =
      core.getInput('destination_repo', {
        required: false,
        trimWhitespace: true,
      }) || DEFAULT_DESTINATION_REPO;
    const eventType =
      core.getInput('event_type', {
        required: false,
        trimWhitespace: true,
      }) || DEFAULT_EVENT_TYPE;
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
