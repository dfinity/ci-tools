import path from 'node:path';
import { exec } from './command';

export function zip(srcPath: string, destPath: string) {
  const zipPath = path.join(destPath, `${srcPath}.zip`);
  exec(`zip -r "${zipPath}" "${srcPath}"`);
}
