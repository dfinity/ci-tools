import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  ALLOWED_VERSIONS_MESSAGE,
  compareVersionPaths,
  isValidVersion,
  isVersionListedInVersionsJson,
} from './versions.ts';

function sorted(paths: string[]): string[] {
  return [...paths].sort(compareVersionPaths);
}

describe('isValidVersion', () => {
  for (const version of ['v1', 'v1.2', 'v1.2.3', 'v10.0', 'v100.200.300']) {
    it(`accepts ${version}`, () => {
      assert.equal(isValidVersion(version), true);
    });
  }

  for (const tag of ['latest', 'beta', 'dev', 'next', 'nightly', 'canary']) {
    it(`accepts the ${tag} tag`, () => {
      assert.equal(isValidVersion(tag), true);
    });
  }

  for (const version of [
    '',
    '1.2.3',
    'v',
    'v1.2.3.4',
    'v1.',
    'va',
    'v1-beta',
    'V1.2.3',
    'stable',
  ]) {
    it(`rejects ${JSON.stringify(version)}`, () => {
      assert.equal(isValidVersion(version), false);
    });
  }

  it('lists every accepted format in the error message', () => {
    assert.equal(
      ALLOWED_VERSIONS_MESSAGE,
      'Allowed values: vX | vX.Y | vX.Y.Z | latest | beta | dev | next | nightly | canary',
    );
  });
});

describe('isVersionListedInVersionsJson', () => {
  it('lists numeric versions and latest', () => {
    assert.equal(isVersionListedInVersionsJson('v10.0'), true);
    assert.equal(isVersionListedInVersionsJson('latest'), true);
  });

  it('omits the other tags', () => {
    assert.equal(isVersionListedInVersionsJson('beta'), false);
    assert.equal(isVersionListedInVersionsJson('nightly'), false);
  });
});

describe('compareVersionPaths', () => {
  it('orders a two-digit major above a one-digit major', () => {
    assert.deepEqual(sorted(['v9.0', 'v10.0']), ['v10.0', 'v9.0']);
  });

  it('keeps latest first', () => {
    assert.deepEqual(sorted(['v4.0', 'latest', 'v10.0']), [
      'latest',
      'v10.0',
      'v4.0',
    ]);
  });

  it('orders the auth versions as the dropdown shows them', () => {
    assert.deepEqual(
      sorted([
        'latest',
        'v9.0',
        'v8.0',
        'v7.1',
        'v7.0',
        'v6.2',
        'v6.1',
        'v6.0',
        'v5.0',
        'v4.2',
        'v4.1',
        'v4.0',
        'v10.0',
      ]),
      [
        'latest',
        'v10.0',
        'v9.0',
        'v8.0',
        'v7.1',
        'v7.0',
        'v6.2',
        'v6.1',
        'v6.0',
        'v5.0',
        'v4.2',
        'v4.1',
        'v4.0',
      ],
    );
  });

  it('compares each part numerically', () => {
    assert.deepEqual(sorted(['v1.9.9', 'v1.10.0', 'v1.10.1', 'v2.0.0']), [
      'v2.0.0',
      'v1.10.1',
      'v1.10.0',
      'v1.9.9',
    ]);
  });

  it('orders a two-digit minor above a one-digit minor', () => {
    assert.deepEqual(sorted(['v0.9', 'v0.23', 'v0.13', 'v0.2']), [
      'v0.23',
      'v0.13',
      'v0.9',
      'v0.2',
    ]);
  });

  it('treats omitted parts as zero', () => {
    assert.deepEqual(sorted(['v3.1', 'v3', 'v3.0.1']), [
      'v3.1',
      'v3.0.1',
      'v3',
    ]);
  });

  it('orders paths for the same version deterministically', () => {
    assert.deepEqual(sorted(['v3.0.0', 'v3', 'v3.0']), [
      'v3',
      'v3.0',
      'v3.0.0',
    ]);
  });

  it('places non-numeric paths last, alphabetically', () => {
    assert.deepEqual(sorted(['next', 'v1.0', 'beta', 'latest', 'v2.0']), [
      'latest',
      'v2.0',
      'v1.0',
      'beta',
      'next',
    ]);
  });

  it('is a consistent ordering', () => {
    const paths = [
      'latest',
      'v100.0',
      'v10.1',
      'v10.0.1',
      'v10',
      'v9.0',
      'v2.0',
      'v0.10',
      'v0.9',
      'beta',
    ];
    const expected = sorted(paths);

    assert.deepEqual(sorted([...paths].reverse()), expected);

    for (const a of paths) {
      assert.equal(compareVersionPaths(a, a), 0, `${a} equals itself`);

      for (const b of paths) {
        assert.equal(
          Math.sign(compareVersionPaths(a, b)) +
            Math.sign(compareVersionPaths(b, a)),
          0,
          `${a} and ${b} compare symmetrically`,
        );
      }
    }
  });
});
