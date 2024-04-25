import * as esbuild from 'esbuild';
import path from 'node:path';

await esbuild.build({
  entryPoints: [path.resolve(import.meta.dirname, 'src', 'index.ts')],
  outfile: path.resolve(import.meta.dirname, 'dist', 'index.js'),
  bundle: true,
  platform: 'node',
  target: 'node20',
  packages: 'external',
});
