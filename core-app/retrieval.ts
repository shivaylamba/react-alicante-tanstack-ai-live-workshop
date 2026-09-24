import { policies } from './policies';
export async function retrievePolicies(query: string) {
  if (process.env.RETRIEVAL_MODE === 'semantic') {
    const { semanticSearch } = await import('./semantic');
    return { mode: 'semantic' as const, sources: await semanticSearch(query) };
  }
  const tokens = query.toLowerCase().match(/[a-z]+/g) ?? [];
  const ranked = policies
    .map((p) => ({
      ...p,
      score: tokens.filter((t) => t.length > 2 && p.keywords.split(' ').includes(t)).length,
    }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
  return { mode: 'lexical' as const, sources: ranked };
}
