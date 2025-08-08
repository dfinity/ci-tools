import * as core from '@actions/core';
import { getInput } from '@dfinity/action-utils';
import fs from 'node:fs';
import path from 'node:path';

type VersionParts = {
  major: string;
  minor: string;
  patch: string;
};

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
  // Accept versions like 1.2.3, 1.2.3-beta.1, 1.2.3+build
  // and only capture the numeric major.minor.patch
  const match = version.trim().match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  const [, major, minor, patch] = match;
  return { major, minor, patch };
}

function extractFromPackageJson(cwd: string): VersionParts | null {
  const file = path.resolve(cwd, 'package.json');
  const json = readJsonFile<{ version?: string }>(file);
  if (!json?.version) return null;
  return parseSemver(json.version);
}

function extractFromCargoToml(cwd: string): VersionParts | null {
  const file = path.resolve(cwd, 'Cargo.toml');
  const text = readTextFile(file);
  if (!text) return null;
  const match = text.match(/^version\s*=\s*["'](?<version>[^"']+)["']/m);
  if (!match?.groups?.version) return null;
  return parseSemver(match.groups.version);
}

function extractFromCzJson(cwd: string): VersionParts | null {
  const file = path.resolve(cwd, 'cz.json');
  const json = readJsonFile<{ commitizen?: { version?: string } }>(file);
  if (!json?.commitizen?.version) return null;
  return parseSemver(json.commitizen.version);
}

export async function run(): Promise<void> {
  try {
    const fileInput = getInput('file');
    const filePath = path.resolve(process.cwd(), fileInput);

    const parts = (() => {
      const lower = path.basename(filePath).toLowerCase();
      if (lower === 'package.json')
        return extractFromPackageJson(path.dirname(filePath));
      if (lower === 'cargo.toml')
        return extractFromCargoToml(path.dirname(filePath));
      if (lower === 'cz.json') return extractFromCzJson(path.dirname(filePath));
      return null;
    })();

    if (!parts) {
      throw new Error(
        `Could not extract a semantic version from '${fileInput}'. Supported files: package.json, Cargo.toml, cz.json`,
      );
    }

    const major = parts.major;
    const majorMinor = `${parts.major}.${parts.minor}`;
    const majorMinorPatch = `${parts.major}.${parts.minor}.${parts.patch}`;

    core.setOutput('major', major);
    core.setOutput('major_minor', majorMinor);
    core.setOutput('major_minor_patch', majorMinorPatch);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
