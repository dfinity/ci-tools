import path from 'node:path';
import * as core from '@actions/core';
import {
  gitAdd,
  gitCommit,
  gitHasChanges,
  gitPushBranch,
  moveFile,
} from '@dfinity/action-utils';
import { upsertVersionsJson } from './upsert-versions-json';
import { zipDocsFolders } from './zip-docs-folders';
import {
  ALLOWED_VERSIONS_MESSAGE,
  isStableVersion,
  isValidVersion,
} from './versions';

const ICP_PAGES_BRANCH_NAME = 'icp-pages';
const ICP_PAGES_FOLDER_NAME = 'icp-pages';

const DEFAULT_LATEST_VERSION_LABEL = 'latest';

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
    const latestVersionLabel =
      core.getInput('latest_version_label', {
        required: false,
        trimWhitespace: true,
      }) || DEFAULT_LATEST_VERSION_LABEL;
    const icpPagesFolderName =
      core.getInput('icp_pages_dir', {
        required: false,
        trimWhitespace: true,
      }) || ICP_PAGES_FOLDER_NAME;

    if (!isValidVersion(docsVersion)) {
      throw new Error(
        `Invalid docs_version '${docsVersion}'. ${ALLOWED_VERSIONS_MESSAGE}`,
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

    if (isStableVersion(docsVersion)) {
      // Only add or update version entries in versions.json for stable versions
      await upsertVersionsJson({
        zipFiles,
        docsVersionLabel,
        latestVersionLabel,
      });
    }

    if (!gitHasChanges()) {
      core.info(
        `No changes to commit. Docs are already up to date for version ${docsVersion}.`,
      );
      if (latestVersionLabel) {
        core.info(`Latest version is already set to ${latestVersionLabel}.`);
      }
      return;
    }

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
