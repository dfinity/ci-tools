export const LATEST_VERSION_NAME = 'latest';

const VALID_TAGS = ['latest', 'beta', 'dev', 'next', 'nightly', 'canary'];
const VALID_VERSION_FORMATS = ['vX', 'vX.Y', 'vX.Y.Z', ...VALID_TAGS];
const VALID_VERSION_PATTERNS = new RegExp(
  `^(?:v\d+(?:\.\d+(?:\.\d+)?)?|${VALID_TAGS.join('|')})$`,
);

export const ALLOWED_VERSIONS_MESSAGE = `Allowed values: ${VALID_VERSION_FORMATS.join(' | ')}`;

export function isVersionListedInVersionsJson(version: string): boolean {
  return version.startsWith('v') || version === LATEST_VERSION_NAME;
}

export function isValidVersion(version: string): boolean {
  return VALID_VERSION_PATTERNS.test(version);
}
