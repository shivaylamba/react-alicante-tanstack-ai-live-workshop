import { build } from 'vite';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
for (const root of ['exercises', 'solutions']) {
  for (const lesson of (await readdir(root)).sort()) {
    await build({
      logLevel: 'error',
      resolve: { alias: { '@lesson': resolve(root, lesson) } },
      build: { write: false },
    });
    console.log(`PASS client build: ${root}/${lesson}`);
  }
}
