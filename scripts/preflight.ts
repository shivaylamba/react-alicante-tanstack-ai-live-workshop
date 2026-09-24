import './env';
const base = process.env.NEBIUS_BASE_URL ?? 'https://api.tokenfactory.nebius.com/v1';
const model = process.env.NEBIUS_MODEL ?? 'zai-org/GLM-5.3-Flash';
if (!process.env.NEBIUS_API_KEY) {
  console.error('Missing NEBIUS_API_KEY. Set it in .env.local (never commit it).');
  process.exit(1);
}
const response = await fetch(base.replace(/\/$/, '') + '/models', {
  headers: { Authorization: `Bearer ${process.env.NEBIUS_API_KEY}` },
  signal: AbortSignal.timeout(15_000),
});
if (!response.ok) throw new Error(`Model discovery failed: HTTP ${response.status}`);
const result = await response.json();
if (!result.data?.some((item: { id: string }) => item.id === model))
  throw new Error(
    `Configured model is unavailable: ${model}. Choose an exact ID from the Token Factory console.`,
  );
console.log(
  `PASS: authenticated; model available: ${model}. Run npm run test:live to check streaming and tool calling (uses tokens).`,
);
