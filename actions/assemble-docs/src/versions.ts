const VALID_VERSION_FORMATS = [
  'vX',
  'vX.Y',
  'vX.Y.Z',
  'beta',
  'dev',
  'next',
  'nightly',
];

const VALID_VERSION_PATTERNS =
  /^(?:v\d+(?:\.\d+(?:\.\d+)?)?|beta|dev|next|nightly)$/;

export const ALLOWED_VERSIONS_MESSAGE = `Allowed values: ${VALID_VERSION_FORMATS.join(' | ')}`;

export const isStableVersion = (version: string): boolean => {
  return version.startsWith('v');
};

export const isValidVersion = (version: string): boolean => {
  return VALID_VERSION_PATTERNS.test(version);
};
