import fs from 'node:fs';

export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function copyFile(src: string, dest: string): void {
  fs.copyFileSync(src, dest);
}
