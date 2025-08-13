import * as core from '@actions/core';
import { Octokit } from '@dfinity/action-utils';

export interface CreateRepositoryDispatchOptions {
  octokit: Octokit;
  owner: string;
  repo: string;
  eventType: string;
  clientPayload: Record<string, unknown>;
}

export async function createRepositoryDispatch({
  octokit,
  owner,
  repo,
  eventType,
  clientPayload,
}: CreateRepositoryDispatchOptions): Promise<void> {
  await octokit.rest.repos.createDispatchEvent({
    owner,
    repo,
    event_type: eventType,
    client_payload: clientPayload,
  });

  core.info(`Created dispatch event ${eventType} on ${owner}/${repo}`);
}
