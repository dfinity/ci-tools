import path from 'node:path';
import * as core from '@actions/core';
import { getInput, getOptInput, zip } from '@dfinity/action-utils';
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
    const targetDir = getInput('target_dir');
    const zipTargetPath = path.join(process.cwd(), targetDir, `${version}.zip`);

    if (!isValidVersion(version)) {
      throw new Error(
        `Invalid version '${version}'. ${ALLOWED_VERSIONS_MESSAGE}`,
      );
    }

    zip(assetsDir, zipTargetPath);

    const versionsJsonPath = path.resolve(
      process.cwd(),
      VERSIONS_JSON_FILE_NAME,
    );

    if (isVersionListedInVersionsJson(version)) {
      await upsertVersionsJson({
        versionsJsonPath,
        version,
        versionLabel,
      });
    }

    core.info(`Docs assembled for version ${version}.`);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
