export const LATEST_VERSION_NAME = 'latest';

const VALID_TAGS = ['latest', 'beta', 'dev', 'next', 'nightly', 'canary'];
const VALID_VERSION_FORMATS = ['vX', 'vX.Y', 'vX.Y.Z', ...VALID_TAGS];
const VALID_VERSION_PATTERNS = new RegExp(
  `^(?:v\\d+(?:\\.\\d+(?:\\.\\d+)?)?|${VALID_TAGS.join('|')})$`,
);

export const ALLOWED_VERSIONS_MESSAGE = `Allowed values: ${VALID_VERSION_FORMATS.join(' | ')}`;

export function isVersionListedInVersionsJson(version: string): boolean {
  return version.startsWith('v') || version === LATEST_VERSION_NAME;
}

export function isValidVersion(version: string): boolean {
  return VALID_VERSION_PATTERNS.test(version);
}

const VERSION_PATH_PATTERN = /^v(\d+)(?:\.(\d+))?(?:\.(\d+))?$/;

function parseVersionPath(versionPath: string): number[] | null {
  const match = VERSION_PATH_PATTERN.exec(versionPath);

  return match
    ? [match[1], match[2], match[3]].map(part => Number(part ?? 0))
    : null;
}

/**
 * Orders version paths for the sidebar version dropdown: `latest` first, then
 * numerically descending so that `v10.0` precedes `v9.0`. Paths that are not
 * numeric versions are placed last and ordered alphabetically.
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

  const parsedA = parseVersionPath(a);
  const parsedB = parseVersionPath(b);

  if (!parsedA || !parsedB) {
    if (parsedA) {
      return -1;
    }
    if (parsedB) {
      return 1;
    }

    return a.localeCompare(b);
  }

  for (let i = 0; i < parsedA.length; i++) {
    if (parsedA[i] !== parsedB[i]) {
      return parsedB[i] - parsedA[i];
    }
  }

  return a.localeCompare(b);
}
