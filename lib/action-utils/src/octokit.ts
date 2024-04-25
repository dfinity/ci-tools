import { getOctokit } from '@actions/github';

export type Octokit = ReturnType<typeof getOctokit>;

export type Graphql = Octokit['graphql'];
