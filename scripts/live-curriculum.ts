import './env';
import assert from 'node:assert/strict';
import { POST as compare } from '../solutions/12-external-agent/compare-server';
import { POST as chat } from '../solutions/12-external-agent/server';
import { validateComparison } from '../core-app/comparison-schema';
import { getProduct } from '../core-app/catalog';
if (process.env.WORKSHOP_MOCK === '1') throw new Error('This test requires real Nebius.');
function request(prompt: string, previous: { role: string; content: string; id: string }[] = []) {
  return new Request('http://localhost:3000/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      threadId: crypto.randomUUID(),
      runId: crypto.randomUUID(),
      tools: [],
      context: [],
      messages: [...previous, { id: crypto.randomUUID(), role: 'user', content: prompt }],
    }),
  });
}
async function read(response: Response) {
  assert(response.ok);
  const chunks = (await response.text())
    .split('\n')
    .filter((line) => line.startsWith('data: {'))
    .map((line) => JSON.parse(line.slice(6)));
  assert(
    !chunks.some((c) => c.type === 'RUN_ERROR'),
    JSON.stringify(chunks.filter((c) => c.type === 'RUN_ERROR')),
  );
  return chunks;
}
const prompt = 'Compare available red T-shirts under €30';
const chunks = await read(await compare(request(prompt)));
const terminal = chunks.find((c) => c.type === 'CUSTOM' && c.name === 'structured-output.complete');
assert(terminal, 'Expected structured completion');
const first = validateComparison(terminal.value.object);
assert(
  first.recommendations.length > 0,
  JSON.stringify(chunks.filter((c) => c.type.startsWith('TOOL_') || c.type === 'CUSTOM')),
);
for (const item of first.recommendations) {
  const p = getProduct(item.productId);
  assert(p.colors.includes('red') && p.priceCents <= 3000);
}
assert(chunks.some((c) => c.type === 'TOOL_CALL_START' && c.toolCallName === 'search_products'));
console.log(
  `PASS real Nebius: catalog tools + streamed structured comparison (${first.recommendations.length} recommendations).`,
);
const secondChunks = await read(
  await compare(
    request('Make the selection cheaper. Keep everything under €20.', [
      { id: crypto.randomUUID(), role: 'user', content: prompt },
      { id: crypto.randomUUID(), role: 'assistant', content: JSON.stringify(first) },
    ]),
  ),
);
const second = validateComparison(
  secondChunks.find((c) => c.type === 'CUSTOM' && c.name === 'structured-output.complete')?.value
    .object,
);
assert(
  secondChunks.some((c) => c.type === 'TOOL_CALL_START' && c.toolCallName === 'search_products'),
  'Follow-up must refresh the catalog without a user reminder',
);
for (const item of second.recommendations) assert(getProduct(item.productId).priceCents < 2000);
console.log('PASS real Nebius: follow-up revision respects the tighter budget.');
const events = await read(
  await chat(
    request('Use search_store_policies to look up the returns policy. Explain it with the source.'),
  ),
);
assert(events.some((c) => c.type === 'CUSTOM' && c.name === 'workshop.middleware'));
assert(
  events.some((c) => c.type === 'TOOL_CALL_START' && c.toolCallName === 'search_store_policies'),
);
console.log('PASS real Nebius: policy retrieval + middleware trace.');
