import * as core from '@actions/core';
import { exec, getOptInput } from '@dfinity/action-utils';
import fs from 'node:fs';
import path from 'node:path';

type VersionParts = {
  major: string;
  minor: string;
  patch: string;
  prerelease: string | null;
};

// TODO: use readJsonFile from @dfinity/action-utils once #46 is merged
function readJsonFile<T = unknown>(filePath: string): T | null {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch {
    return null;
  }
}

function readTextFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function parseSemver(version: string): VersionParts | null {
  // Accept versions like 1.2.3, 1.2.3-beta.1, 1.2.3+build, etc.
  const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)([-+].+)?$/);
  if (!match) {
    throw new Error(`Invalid version: ${version}`);
  }
  const [, major, minor, patch, prerelease] = match;
  return {
    major,
    minor,
    patch,
    prerelease: prerelease || null,
  };
}

function extractFromPackageJson(filePath: string): VersionParts | null {
  const json = readJsonFile<{ version?: string }>(filePath);
  if (!json?.version) {
    return null;
  }
  return parseSemver(json.version);
}

function extractFromCargoToml(filePath: string): VersionParts | null {
  const text = readTextFile(filePath);
  if (!text) {
    return null;
  }
  const match = text.match(/^version\s*=\s*["'](?<version>[^"']+)["']/m);
  if (!match?.groups?.version) {
    return null;
  }
  return parseSemver(match.groups.version);
}

export async function run(): Promise<void> {
  try {
    const fileInput = getOptInput('file', '');

    let parts: VersionParts | null = null;

    if (fileInput) {
      const filePath = path.resolve(process.cwd(), fileInput);
      const lowerFilename = path.basename(filePath).toLowerCase();

      if (lowerFilename === 'package.json') {
        parts = extractFromPackageJson(filePath);
      } else if (lowerFilename === 'cargo.toml') {
        parts = extractFromCargoToml(filePath);
      }
    } else {
      try {
        const output = exec('cz version -p').trim();
        parts = parseSemver(output);
      } catch (err) {
        throw new Error(`Failed to execute 'cz version -p': ${err}`);
      }
    }

    if (!parts) {
      throw new Error('Could not extract a semantic version.');
    }

    core.setOutput('major', parts.major);
    core.setOutput('minor', parts.minor);
    core.setOutput('patch', parts.patch);
    core.setOutput('prerelease', parts.prerelease || '');
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
