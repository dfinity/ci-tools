import { writeJsonFile, readJsonFile } from '@dfinity/action-utils';
import { compareVersionPaths } from './versions';

type VersionEntry = { path: string; label: string; versionInTitle?: string };

export async function upsertVersionsJson(params: {
  versionsJsonPath: string;
  version: string;
  versionLabel: string;
  versionInTitle?: string;
}): Promise<void> {
  const { versionsJsonPath, version, versionLabel, versionInTitle } = params;

  const versions = readJsonFile<VersionEntry[]>(versionsJsonPath) || [];

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
    const newVersionEntry: VersionEntry = {
      path: version,
      label: versionLabel,
    };
    if (versionInTitle) {
      newVersionEntry.versionInTitle = versionInTitle;
    }
    versions.push(newVersionEntry);
  }

  versions.sort((a, b) => compareVersionPaths(a.path, b.path));

  writeJsonFile(versionsJsonPath, versions);
}
