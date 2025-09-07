import { writeJsonFile, readJsonFile } from '@dfinity/action-utils';
import { LATEST_VERSION_NAME } from './versions';

type VersionEntry = { path: string; label: string; versionInTitle?: string };

export async function upsertVersionsJson(params: {
  versionsJsonPath: string;
  version: string;
  versionLabel: string;
  versionInTitle?: string;
}): Promise<void> {
  const { versionsJsonPath, version, versionLabel, versionInTitle } = params;

  let versions = readJsonFile<VersionEntry[]>(versionsJsonPath) || [];

  const versionEntryIndex = versions.findIndex(v => v.path === version);
  if (versionEntryIndex !== -1) {
    const versionEntry = versions[versionEntryIndex];
    versionEntry.label = versionLabel;
    if (versionInTitle) {
      versionEntry.versionInTitle = versionInTitle;
    } else {
      delete versionEntry.versionInTitle;
    }
    versions[versionEntryIndex] = versionEntry;
  } else {
    versions.push({ path: version, label: versionLabel, versionInTitle });
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
