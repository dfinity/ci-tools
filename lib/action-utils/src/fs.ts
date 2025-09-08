import fs from 'node:fs';
import path from 'node:path';

export function moveFile(src: string, dest: string): void {
  fs.renameSync(src, dest);
}

export function deleteFile(filePath: string): void {
  try {
    fs.rmSync(filePath);
  } catch {
    // ignore if file does not exist
  }
}

export function absolutePath(p: string): string {
  return p.startsWith('/') ? p : path.join(process.cwd(), p);
}
