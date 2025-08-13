import fs from 'node:fs';

export function moveFile(src: string, dest: string): void {
  fs.renameSync(src, dest);
}

export function deleteFile(path: string): void {
  try {
    fs.rmSync(path);
  } catch {
    // ignore if file does not exist
  }
}
