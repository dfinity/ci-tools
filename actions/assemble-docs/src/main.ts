import path from 'node:path';
import * as core from '@actions/core';
import {
  absolutePath,
  deleteFile,
  getInput,
  getOptInput,
  zip,
} from '@dfinity/action-utils';
import { upsertVersionsJson } from './upsert-versions-json';
import {
  ALLOWED_VERSIONS_MESSAGE,
  isVersionListedInVersionsJson,
  isValidVersion,
} from './versions';

const VERSIONS_JSON_FILE_NAME = 'versions.json';

export async function run(): Promise<void> {
  try {
    const assetsDir = getInput('assets_dir');
    const version = getInput('version');
    const versionLabel = getOptInput('version_label', version);
    const versionInTitle = getOptInput('version_in_title', '');
    const targetDir = getInput('target_dir');

    const absoluteAssetsDir = absolutePath(assetsDir);
    const absoluteTargetDir = absolutePath(targetDir);
    const targetZipFile = path.join(absoluteTargetDir, `${version}.zip`);
    const targetVersionsJsonFile = path.join(
      absoluteTargetDir,
      VERSIONS_JSON_FILE_NAME,
    );

    if (!isValidVersion(version)) {
      throw new Error(
        `Invalid version '${version}'. ${ALLOWED_VERSIONS_MESSAGE}`,
      );
    }

    core.info(`Cleaning up ${targetZipFile}`);
    deleteFile(targetZipFile);

    core.info(`Zipping ${absoluteAssetsDir} to ${targetZipFile}`);
    zip({
      absoluteSrcPath: absoluteAssetsDir,
      absoluteDestPath: targetZipFile,
    });

    if (isVersionListedInVersionsJson(version)) {
      core.info(`Upserting versions.json for version ${version}`);
      await upsertVersionsJson({
        versionsJsonPath: targetVersionsJsonFile,
        version,
        versionLabel,
        versionInTitle,
      });
    }

    core.info(`Docs assembled for version ${version}.`);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
