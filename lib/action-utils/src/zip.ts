import { exec, inDir } from './command';

export function zip({
  absoluteSrcPath,
  absoluteDestPath,
}: {
  absoluteSrcPath: string;
  absoluteDestPath: string;
}) {
  inDir(absoluteSrcPath, () => {
    exec(`zip -r "${absoluteDestPath}" .`);
  });
}
