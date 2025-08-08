import fs from 'node:fs';
import path from 'node:path';
import { writeJsonFile, readJsonFile } from '@dfinity/action-utils';

const LATEST_VERSION_NAME = 'latest';
const VERSIONS_JSON_FILE_NAME = 'versions.json';

type VersionEntry = { path: string; label: string };

export async function upsertVersionsJson(params: {
  zipsPaths: string[];
  docsVersionLabel?: string;
  latestVersion?: string;
}): Promise<void> {
  const { zipsPaths, docsVersionLabel, latestVersion } = params;

  const versionsPath = path.resolve(process.cwd(), VERSIONS_JSON_FILE_NAME);

  let versions: VersionEntry[] =
    readJsonFile<VersionEntry[]>(versionsPath) || [];

  for (const zipPath of zipsPaths) {
    const versionName = path.basename(zipPath, '.zip');
    const isLatest = versionName === LATEST_VERSION_NAME;
    const existing = versions.find(v => v.path === versionName);

    if (existing) {
      if (isLatest && latestVersion) {
        existing.label = `${LATEST_VERSION_NAME} (${latestVersion})`;
      }
      if (!isLatest && docsVersionLabel) {
        existing.label = docsVersionLabel;
      }
    } else {
      const label = isLatest
        ? latestVersion
          ? `latest (${latestVersion})`
          : 'latest'
        : docsVersionLabel || versionName;

      versions.push({ path: versionName, label });
    }
  }

  // Sort versions: latest first, then others alphabetically by path
  versions = versions.sort((a, b) => {
    if (a.path === LATEST_VERSION_NAME && b.path !== LATEST_VERSION_NAME) {
      return -1;
    }
    if (b.path === LATEST_VERSION_NAME && a.path !== LATEST_VERSION_NAME) {
      return 1;
    }
    return a.path.localeCompare(b.path);
  });

  writeJsonFile(versionsPath, versions);
}
