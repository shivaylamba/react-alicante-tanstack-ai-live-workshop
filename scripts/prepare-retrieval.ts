import { mkdir, writeFile } from 'node:fs/promises';
import { embed, model } from '../core-app/semantic';
import { policies } from '../core-app/policies';
const vectors = await embed(policies.map((p) => `${p.title}. ${p.questions} ${p.text}`));
await mkdir('.cache', { recursive: true });
await writeFile(
  '.cache/policies.json',
  JSON.stringify({ model, corpus: JSON.stringify(policies), vectors }),
);
console.log(
  `Prepared ${vectors.length} policy vectors with ${model}. Set RETRIEVAL_MODE=semantic and restart.`,
);
