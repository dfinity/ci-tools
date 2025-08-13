import fs from 'node:fs';
import * as core from '@actions/core';

export function writeJsonFile<T>(filePath: string, data: T): void {
  const json = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(filePath, json, 'utf8');
}

export function readJsonFile<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch (err) {
    core.info(
      `Could not read or parse JSON file ${filePath}. Reason: ${(err as Error).message}`,
    );
    return null;
  }
}
