import path from 'node:path';
import * as core from '@actions/core';
import {
  gitAdd,
  gitCommit,
  gitPushBranch,
  moveFile,
} from '@dfinity/action-utils';
import { upsertVersionsJson } from './upsert-versions-json';
import { zipDocsFolders } from './zip-docs-folders';

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

const ICP_PAGES_BRANCH_NAME = 'icp-pages';
const ICP_PAGES_FOLDER_NAME = 'icp-pages';

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
    const docsVersionLabel = core.getInput('docs_version_label', {
      required: false,
      trimWhitespace: true,
    });
    const latestVersion = core.getInput('latest_version', {
      required: false,
      trimWhitespace: true,
    });
    const icpPagesFolderName =
      core.getInput('icp_pages_dir', {
        required: false,
        trimWhitespace: true,
      }) || ICP_PAGES_FOLDER_NAME;
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

    // Copy the zips into the icp-pages folder
    const zipFiles = [];
    for (const zipPath of zipsPaths) {
      const zipName = path.basename(zipPath);
      moveFile(zipPath, `${icpPagesFolderName}/${zipName}`);
      zipFiles.push(zipName);
    }

    // Change working directory to the icp-pages folder
    process.chdir(icpPagesFolderName);

    await upsertVersionsJson({
      zipFiles,
      docsVersionLabel,
      latestVersion,
    });

    gitAdd();
    gitCommit(
      `Update static assets for docs version ${docsVersion}`,
      'github-actions[bot]',
      '41898282+github-actions[bot]@users.noreply.github.com',
    );
    gitPushBranch(ICP_PAGES_BRANCH_NAME);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
