import { test } from 'node:test';
import assert from 'node:assert/strict';
import { externalAgentStep } from '../core-app/external-agent-api';
test('external runner rejects cross-origin requests before provider access', async () => {
  const response = await externalAgentStep(
    new Request('http://localhost:3000/api/external-agent', {
      method: 'POST',
      headers: { origin: 'https://other.example' },
      body: '{}',
    }),
  );
  assert.equal(response.status, 403);
});
test('external runner passes discovered schemas with automatic model selection', async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.NEBIUS_API_KEY;
  process.env.NEBIUS_API_KEY = 'test-only';
  try {
    globalThis.fetch = async (_url, options) => {
      const body = JSON.parse(String(options?.body));
      assert.equal(body.tool_choice, 'auto');
      assert.deepEqual(body.tools[0].function.parameters, {
        type: 'object',
        properties: { color: { type: 'string' } },
      });
      assert.equal(body.messages.at(-1).content, 'Hello!');
      return Response.json({ choices: [{ message: { role: 'assistant', content: 'Hello!' } }] });
    };
    const result = await externalAgentStep(
      new Request('http://localhost:3000/api/external-agent', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000' },
        body: JSON.stringify({
          tools: [
            {
              name: 'filter_products',
              description: 'Discovered description',
              inputSchema: { type: 'object', properties: { color: { type: 'string' } } },
            },
          ],
          messages: [{ role: 'user', content: 'Hello!' }],
        }),
      }),
    );
    assert.equal(result.status, 200);
    assert.equal((await result.json()).message.content, 'Hello!');
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.NEBIUS_API_KEY;
    else process.env.NEBIUS_API_KEY = originalKey;
  }
});

test('external runner rejects undeclared actions and malformed JSON before inference', async () => {
  for (const body of [
    '{bad',
    JSON.stringify({
      tools: [{ name: 'add_to_cart', description: 'write', inputSchema: {} }],
      messages: [{ role: 'user', content: 'buy' }],
    }),
  ]) {
    const response = await externalAgentStep(
      new Request('http://localhost:3000/api/external-agent', {
        method: 'POST',
        headers: { origin: 'http://localhost:3000' },
        body,
      }),
    );
    assert.equal(response.status, 400);
  }
});
