import { writeJsonFile, readJsonFile } from '@dfinity/action-utils';
import { LATEST_VERSION_NAME } from './versions';

type VersionEntry = { path: string; label: string };

export async function upsertVersionsJson(params: {
  versionsJsonPath: string;
  version: string;
  versionLabel: string;
}): Promise<void> {
  const { versionsJsonPath, version, versionLabel } = params;

  let versions = readJsonFile<VersionEntry[]>(versionsJsonPath) || [];

  const versionEntry = versions.find(v => v.path === version);
  if (versionEntry) {
    versionEntry.label = versionLabel;
  } else {
    versions.push({ path: version, label: versionLabel });
  }

  // Sort versions: latest first, then reverse alphabetically by path
  versions = versions.sort((a, b) => {
    if (a.path === LATEST_VERSION_NAME && b.path !== LATEST_VERSION_NAME) {
      return -1;
    }
    if (b.path === LATEST_VERSION_NAME && a.path !== LATEST_VERSION_NAME) {
      return 1;
    }
    return b.path.localeCompare(a.path);
  });

  writeJsonFile(versionsJsonPath, versions);
}
