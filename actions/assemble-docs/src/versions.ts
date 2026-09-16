export const LATEST_VERSION_NAME = 'latest';

const VALID_TAGS = ['latest', 'beta', 'dev', 'next', 'nightly', 'canary'];
const VALID_VERSION_FORMATS = ['vX', 'vX.Y', 'vX.Y.Z', ...VALID_TAGS];

/** Number of parts in a fully qualified `vX.Y.Z` version. */
const VERSION_PART_COUNT = 3;

const NUMERIC_VERSION_SOURCE = `v\\d+(?:\\.\\d+){0,${VERSION_PART_COUNT - 1}}`;
const NUMERIC_VERSION_PATTERN = new RegExp(`^${NUMERIC_VERSION_SOURCE}$`);
const VALID_VERSION_PATTERN = new RegExp(
  `^(?:${NUMERIC_VERSION_SOURCE}|${VALID_TAGS.join('|')})$`,
);

export const ALLOWED_VERSIONS_MESSAGE = `Allowed values: ${VALID_VERSION_FORMATS.join(' | ')}`;

export function isVersionListedInVersionsJson(version: string): boolean {
  return version.startsWith('v') || version === LATEST_VERSION_NAME;
}

export function isValidVersion(version: string): boolean {
  return VALID_VERSION_PATTERN.test(version);
}

/**
 * Splits a `vX`, `vX.Y` or `vX.Y.Z` path into exactly `VERSION_PART_COUNT`
 * numbers, padding the parts that are left out so that `v10` and `v10.0.0`
 * compare as equal. Returns `null` for any other path, such as a `beta` tag.
 */
function parseVersionPath(versionPath: string): number[] | null {
  if (!NUMERIC_VERSION_PATTERN.test(versionPath)) {
    return null;
  }

  const parts = versionPath.slice(1).split('.').map(Number);
  const omittedParts = Array<number>(VERSION_PART_COUNT - parts.length).fill(0);

  return [...parts, ...omittedParts];
}

/**
 * Orders `versions.json` entries the way the sidebar version dropdown reads
 * them: `latest` first, then the numeric versions from newest to oldest, then
 * any remaining path alphabetically.
 */
export function compareVersionPaths(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  if (a === LATEST_VERSION_NAME) {
    return -1;
  }
  if (b === LATEST_VERSION_NAME) {
    return 1;
  }

  const partsA = parseVersionPath(a);
  const partsB = parseVersionPath(b);

  if (partsA === null || partsB === null) {
    if (partsA !== null) {
      return -1;
    }
    if (partsB !== null) {
      return 1;
    }

    return a.localeCompare(b);
  }

  for (let i = 0; i < VERSION_PART_COUNT; i++) {
    if (partsA[i] !== partsB[i]) {
      return partsB[i] - partsA[i];
    }
  }

  // Different paths for the same version, such as `v10` and `v10.0`.
  return a.localeCompare(b);
}
