import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'child_process';
import * as core from '@actions/core';

const LATEST_FOLDER_NAME = 'latest';

function zipFolder(params: { absDir: string; folderName: string }): string {
  const { absDir, folderName } = params;
  const folderPath = path.join(absDir, folderName);

  if (!fs.existsSync(folderPath)) {
    throw new Error(`Folder does not exist: ${folderPath}`);
  }

  const zipName = `${folderName}.zip`;
  const zipPath = path.join(absDir, zipName);

  core.info(`Zipping ${folderPath} -> ${zipPath}`);
  // Use native zip available on macOS/ubuntu-latest runners
  // -r recursive, -q quiet, -X strip extra file attrs
  execSync(`zip -rqX ${zipName} ${folderName}`, {
    cwd: absDir,
  });

  return zipPath;
}

export async function zipDocsFolders(
  docsOutputDir: string,
  docsVersionFolderName: string,
): Promise<string[]> {
  const absDir = path.resolve(process.cwd(), docsOutputDir);

  if (!fs.existsSync(absDir)) {
    throw new Error(`docs_output_dir does not exist: ${absDir}`);
  }

  const zippedFoldersPaths = [];

  const versionZipPath = zipFolder({
    absDir,
    folderName: docsVersionFolderName,
  });
  zippedFoldersPaths.push(versionZipPath);

  if (fs.existsSync(path.join(absDir, LATEST_FOLDER_NAME))) {
    const latestZipPath = zipFolder({
      absDir,
      folderName: LATEST_FOLDER_NAME,
    });
    zippedFoldersPaths.push(latestZipPath);
  }

  return zippedFoldersPaths;
}
