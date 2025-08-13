import { exec } from './command';

export function zip(srcPath: string, destPath: string) {
  exec(`zip -r "${destPath}" "${srcPath}"`);
}
