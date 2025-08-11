import fs from 'node:fs';

export function moveFile(src: string, dest: string): void {
  fs.renameSync(src, dest);
}
