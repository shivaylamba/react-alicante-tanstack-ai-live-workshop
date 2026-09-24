import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pipeline, env, type FeatureExtractionPipeline } from '@huggingface/transformers';
import { policies } from './policies';
export const model = 'Xenova/all-MiniLM-L6-v2';
env.cacheDir = resolve('.cache/models');
let extractor: Promise<FeatureExtractionPipeline> | undefined;
export async function embed(texts: string[]) {
  extractor ??= pipeline('feature-extraction', model, { dtype: 'q8' });
  const output = await (await extractor)(texts, { pooling: 'mean', normalize: true });
  return output.tolist() as number[][];
}
export async function semanticSearch(query: string) {
  const index = JSON.parse(await readFile(resolve('.cache/policies.json'), 'utf8'));
  if (index.model !== model || index.corpus !== JSON.stringify(policies))
    throw new Error('Retrieval index stale. Run npm run prepare:retrieval.');
  const [vector] = await embed([query]);
  return policies
    .map((p, i) => {
      const stored: number[] = index.vectors[i];
      if (stored.length !== vector.length) throw new Error('Embedding dimension mismatch');
      return { ...p, score: stored.reduce((sum, v, j) => sum + v * vector[j], 0) };
    })
    .filter((p) => p.score >= 0.32)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
}
