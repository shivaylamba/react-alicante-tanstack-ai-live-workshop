import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startMockProvider } from '../core-app/mocks/provider';
const names = [
  'server',
  'streaming',
  'catalog-tools',
  'product-ui',
  'structured-comparison',
  'retrieval',
  'cart-approval',
  'shopping-agent',
  'middleware',
  'debugging',
  'webmcp',
  'external-agent',
];
test('all twelve solution endpoints stream through the installed provider adapter', async () => {
  process.env.WORKSHOP_MOCK = '1';
  const provider = await startMockProvider();
  try {
    for (const [index, name] of names.entries()) {
      const module = await import(
        `../solutions/${String(index + 1).padStart(2, '0')}-${name}/server.ts`
      );
      const response: Response = await module.POST(
        new Request('http://localhost:3000/api/chat', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            threadId: crypto.randomUUID(),
            runId: crypto.randomUUID(),
            tools: [],
            context: [],
            messages: [{ id: crypto.randomUUID(), role: 'user', content: 'Find red t-shirts' }],
          }),
        }),
      );
      assert.match(response.headers.get('content-type')!, /text\/event-stream/);
      const body = await response.text();
      assert(body.includes('TEXT_MESSAGE_CONTENT'), name);
      assert(!body.includes('RUN_ERROR'), name);
      if (index >= 2) assert(body.includes('search_products'), name);
    }
    // Exercise the new boundaries through the actual installed adapter/agent loop.
    const request = (prompt: string, fault = 'none') =>
      new Request('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-workshop-fault': fault },
        body: JSON.stringify({
          threadId: crypto.randomUUID(),
          runId: crypto.randomUUID(),
          tools: [],
          context: [],
          messages: [{ id: crypto.randomUUID(), role: 'user', content: prompt }],
        }),
      });
    for (const [index, name] of names.entries()) {
      if (index < 4) continue;
      const module = await import(
        `../solutions/${String(index + 1).padStart(2, '0')}-${name}/compare-server.ts`
      );
      const body = await (await module.POST(request('Compare red T-shirts'))).text();
      assert(body.includes('structured-output.complete'), name);
      assert(body.includes('fire-t-shirt'), name);
      assert(!body.includes('RUN_ERROR'), body);
    }
    const comparison = await import('../solutions/05-structured-comparison/compare-server');
    // A model that would skip retrieval must still search when the provider
    // receives our forced choice. Also checks release before finalization.
    const forced = await (
      await comparison.POST(
        request('Make the selection cheaper. Keep everything under €20.', 'skip-search'),
      )
    ).text();
    assert(forced.includes('search_products'));
    assert(forced.includes('structured-output.complete'));
    assert(!forced.includes('RUN_ERROR'), forced);
    const completion = forced
      .split('\n')
      .filter((line) => line.startsWith('data: {'))
      .map((line) => JSON.parse(line.slice(6)))
      .find((event) => event.name === 'structured-output.complete');
    assert.deepEqual(completion.value.object.recommendations, []);
    const invalid = await (
      await comparison.POST(request('Compare red T-shirts', 'invalid-comparison'))
    ).text();
    assert(invalid.includes('RUN_ERROR'));
    assert(!invalid.includes('structured-output.complete'));
    const empty = await (await comparison.POST(request('no match'))).text();
    assert(empty.includes('structured-output.complete'));
    const final = await import('../solutions/12-external-agent/server');
    const budget = await (await final.POST(request('Find products', 'tool-budget'))).text();
    assert(budget.includes('Tool budget reached (2)'), budget);
    assert.equal(
      (budget.match(/\"type\":\"TOOL_CALL_RESULT\"/g) ?? []).length,
      2,
      'third tool must not execute',
    );
    const cache = await (await final.POST(request('return policy', 'policy-cache'))).text();
    assert(cache.includes('Policy cache miss'), cache);
    assert(cache.includes('Policy cache hit'), cache);
    assert(!cache.includes('RUN_ERROR'), cache);
  } finally {
    await new Promise<void>((resolve) => provider.close(() => resolve()));
  }
});
