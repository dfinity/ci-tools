import * as core from '@actions/core';
import { exec } from '@dfinity/action-utils';
import { upsertVersionsJson } from './upsert-versions-json';
import { zipDocsFolders } from './zip-docs-folders';
import { execSync } from 'child_process';

const VALID_VERSION_FORMATS = [
  'vX',
  'vX.Y',
  'vX.Y.Z',
  'beta',
  'dev',
  'next',
  'nightly',
];
const VALID_VERSION_PATTERNS =
  /^(?:v\d+(?:\.\d+(?:\.\d+)?)?|beta|dev|next|nightly)$/;

export async function run(): Promise<void> {
  try {
    const docsOutputDir = core.getInput('docs_output_dir', {
      required: true,
      trimWhitespace: true,
    });
    const docsVersion = core.getInput('docs_version', {
      required: true,
      trimWhitespace: true,
    });
    const latestVersion = core.getInput('latest_version', {
      required: false,
      trimWhitespace: true,
    });
    const githubToken = core.getInput('github_token', {
      required: true,
      trimWhitespace: true,
    });

    if (!VALID_VERSION_PATTERNS.test(docsVersion)) {
      throw new Error(
        `Invalid docs_version '${docsVersion}'. Allowed values: ${VALID_VERSION_FORMATS.join(' | ')}`,
      );
    }

    if (latestVersion && !VALID_VERSION_PATTERNS.test(latestVersion)) {
      throw new Error(
        `Invalid latest_version '${latestVersion}'. Allowed values: ${VALID_VERSION_FORMATS.join(' | ')}`,
      );
    }

    const zipsPaths = await zipDocsFolders(docsOutputDir, docsVersion);

    exec(`git fetch origin icp-pages:icp-pages`);
    exec(`git switch icp-pages`);

    await upsertVersionsJson({
      zipsPaths,
      latestVersion,
    });

    exec(`git config user.name "github-actions[bot]"`);
    exec(
      `git config user.email "github-actions[bot]@users.noreply.github.com"`,
    );
    exec('git add .');
    const commitMessage = `Update static assets for docs version ${docsVersion}`;
    exec(`git commit -m "${commitMessage}" || echo "No changes to commit"`);
    execSync('git push origin icp-pages', {
      env: {
        GITHUB_TOKEN: githubToken,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
