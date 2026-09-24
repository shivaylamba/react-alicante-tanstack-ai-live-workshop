import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';
// Deliberately deterministic OpenAI wire fixture, NOT a language model.
// It runs beneath the real TanStack adapter/agent loop so UI and approval tests use real protocol code.
export async function startMockProvider() {
  const server = createServer(async (req, res) => {
    if (req.url === '/v1/models') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: [{ id: 'workshop-fixture' }] }));
      return;
    }
    if (req.url !== '/v1/chat/completions') {
      res.writeHead(404).end();
      return;
    }
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 200_000) {
        res.writeHead(413).end();
        return;
      }
    }
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const fault = req.headers['x-workshop-fault'];
    if (fault === 'rate-limit') {
      res.writeHead(429, { 'Content-Type': 'application/json' }).end(
        JSON.stringify({
          error: {
            message: 'Workshop fixture: rate limited. Disable fault and resend.',
            type: 'rate_limit_error',
          },
        }),
      );
      return;
    }
    if (body.response_format?.type === 'json_schema' && body.tool_choice?.type === 'function') {
      res.writeHead(400, { 'Content-Type': 'application/json' }).end(
        JSON.stringify({
          error: { message: 'Forced tool choice must be removed before structured finalization.' },
        }),
      );
      return;
    }
    const messages = body.messages ?? [];
    const lastUserIndex = messages.findLastIndex((m: { role: string }) => m.role === 'user');
    const content = messages[lastUserIndex]?.content;
    const prompt = (
      typeof content === 'string' ? content : JSON.stringify(content ?? '')
    ).toLowerCase();
    const after = messages.slice(lastUserIndex + 1);
    const results = after.filter((m: { role: string }) => m.role === 'tool');
    const called = after
      .flatMap((m: { tool_calls?: { function: { name: string } }[] }) => m.tool_calls ?? [])
      .map((t: { function: { name: string } }) => t.function.name);
    const has = (name: string) =>
      body.tools?.some((t: { function: { name: string } }) => t.function.name === name);
    let name = '',
      args = {};
    if (fault === 'tool-budget' && has('search_products')) {
      name = 'search_products';
      args = { query: 't-shirt', color: 'red' };
    } else if (
      fault === 'policy-cache' &&
      has('search_store_policies') &&
      called.filter((n: string) => n === 'search_store_policies').length < 2
    ) {
      name = 'search_store_policies';
      args = { query: 'workshop cache probe returns' };
    } else if (
      /filter/.test(prompt) &&
      has('filter_products') &&
      !called.includes('filter_products')
    ) {
      name = 'filter_products';
      args = { category: 'all', color: 'red' };
    } else if (
      has('search_products') &&
      !called.includes('search_products') &&
      (fault !== 'skip-search' || body.tool_choice?.function?.name === 'search_products')
    ) {
      name = 'search_products';
      args = {
        query: 't-shirt',
        color: 'red',
        ...(/cheaper|€20/.test(prompt) ? { maxPrice: /under €20/.test(prompt) ? 19.99 : 20 } : {}),
        ...(/no match/.test(prompt) ? { query: 'lunar-submarine' } : {}),
      };
    } else if (
      has('search_store_policies') &&
      /return|policy|shipping|insurance/.test(prompt) &&
      !called.includes('search_store_policies')
    ) {
      name = 'search_store_policies';
      // Preserve the question so unsupported-policy exercises can produce no sources.
      args = { query: prompt };
    } else if (
      has('add_to_cart') &&
      /add|bag|cart/.test(prompt) &&
      !called.includes('add_to_cart')
    ) {
      name = 'add_to_cart';
      args = {
        productId: fault === 'tool-error' ? 'missing-product' : 'fire-t-shirt',
        color: 'red',
        size: 'm',
        quantity: 1,
        requestId: 'fixture-' + lastUserIndex,
      };
    }
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
    const id = 'chatcmpl-' + crypto.randomUUID();
    const chunk = (delta: unknown, finish_reason: string | null = null) =>
      res.write(
        'data: ' +
          JSON.stringify({
            id,
            object: 'chat.completion.chunk',
            created: Math.floor(Date.now() / 1000),
            model: body.model,
            choices: [{ index: 0, delta, finish_reason }],
          }) +
          '\n\n',
      );
    chunk({ role: 'assistant', content: '' });
    if (name) {
      chunk({
        tool_calls: [
          {
            index: 0,
            id: 'call_' + crypto.randomUUID(),
            type: 'function',
            function: { name, arguments: '' },
          },
        ],
      });
      chunk({ tool_calls: [{ index: 0, function: { arguments: JSON.stringify(args) } }] });
      chunk({}, 'tool_calls');
    } else {
      const structured = body.response_format?.type === 'json_schema';
      const comparison = {
        title: /cheaper|€20/.test(prompt) ? 'A cheaper selection' : 'Your red T-shirt shortlist',
        recommendations: /no match|under €20/.test(prompt)
          ? []
          : [
              {
                productId: fault === 'invalid-comparison' ? 'made-up-product' : 'fire-t-shirt',
                reason: 'Matches your red preference.',
              },
              ...(/cheaper|€20/.test(prompt)
                ? []
                : [{ productId: 'racing-t-shirt', reason: 'Another red option.' }]),
            ],
        followUpQuestion: 'Which design do you prefer?',
      };
      const text = structured
        ? JSON.stringify(comparison)
        : results.length
          ? 'Fixture run complete. Inspect the actual tool results above; they determine whether the cart changed.'
          : 'Fixture response: tokens are small pieces of text emitted incrementally. This is deterministic practice mode.';
      for (const word of structured
        ? text.match(/.{1,24}/g)!
        : text.split(' ').map((w: string) => w + ' ')) {
        if (res.destroyed) return;
        chunk({ content: word });
        await delay(fault === 'slow' ? 300 : 12);
      }
      chunk({}, 'stop');
    }
    res.end('data: [DONE]\n\n');
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(4010, '127.0.0.1', resolve);
  });
  return server;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await startMockProvider();
  console.log('Fixture provider listening on 127.0.0.1:4010');
}
