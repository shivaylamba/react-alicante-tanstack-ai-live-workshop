import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerWebMCPTools } from '@tanstack/ai-client';
import { filterDef, cartDef } from '../core-app/definitions';
import { filterProducts, addToCart } from '../core-app/browser-state';
import { browserTools } from '../core-app/webmcp-tools';

test('WebMCP registrar validates, invokes, rejects approval tools, and cleans up (test double)', async () => {
  type Tool = { name: string; execute: (input: unknown) => Promise<unknown> };
  const tools = new Map<string, Tool>();
  const prior = Object.getOwnPropertyDescriptor(globalThis, 'document');
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      modelContext: {
        registerTool(tool: Tool, options: { signal: AbortSignal }) {
          tools.set(tool.name, tool);
          options.signal.addEventListener('abort', () => tools.delete(tool.name), { once: true });
        },
      },
    },
  });
  try {
    const controller = new AbortController();
    await registerWebMCPTools(browserTools, { signal: controller.signal });
    assert.deepEqual(
      [...tools.keys()],
      [
        'search_products',
        'get_product_details',
        'search_store_policies',
        'filter_products',
        'show_product',
      ],
    );
    const search = (await tools
      .get('search_products')!
      .execute({ color: 'red', size: 'm', maxPrice: 30, availableOnly: true })) as {
      products: { id: string }[];
    };
    assert(search.products.some((p) => p.id === 'fire-t-shirt'));
    const detail = (await tools
      .get('get_product_details')!
      .execute({ productId: 'fire-t-shirt' })) as { priceCents: number };
    assert.equal(detail.priceCents, 2000);
    const shown = (await tools.get('show_product')!.execute({ productId: 'fire-t-shirt' })) as {
      href: string;
    };
    assert.equal(shown.href, '/?product=fire-t-shirt');
    await assert.rejects(
      tools.get('show_product')!.execute({ productId: 'missing' }),
      /Unknown product/,
    );
    assert(
      (
        (await tools.get('filter_products')!.execute({ category: 'all', color: 'red' })) as {
          visible: number;
        }
      ).visible > 0,
    );
    await assert.rejects(
      tools.get('filter_products')!.execute({ color: 'Invalid' }),
      /Validation failed/,
    );
    await assert.rejects(
      registerWebMCPTools([cartDef.client(addToCart)], { signal: controller.signal }),
      /needsApproval/,
    );
    controller.abort();
    assert.equal(tools.size, 0);
  } finally {
    if (prior) Object.defineProperty(globalThis, 'document', prior);
    else Reflect.deleteProperty(globalThis, 'document');
  }
});

test('shopping browser tools return grounded facts and reject unsupported calls', async () => {
  const { browserTools, showProduct } = await import('../core-app/webmcp-tools');
  const { webmcpNames, validateBrowserCall } = await import('../core-app/webmcp-contract');
  assert.deepEqual(
    browserTools.map((t) => t.name),
    [...webmcpNames],
  );
  assert(!browserTools.map((t) => String(t.name)).includes('add_to_cart'));
  assert.throws(() => validateBrowserCall('add_to_cart', {}), /allowlist/);
  assert.throws(() => validateBrowserCall('search_products', { size: 'medium' }));
  assert.throws(() => showProduct({ productId: 'fabricated' }), /Unknown product/);
  assert.equal(showProduct({ productId: 'fire-t-shirt' }).href, '/?product=fire-t-shirt');
});

test('browser policy endpoint validates origin, JSON and grounded source output', async () => {
  const { browserPolicyLookup } = await import('../core-app/browser-policy-api');
  const request = (body: string, origin = 'http://localhost:3000') =>
    new Request('http://localhost:3000/api/browser-policies', {
      method: 'POST',
      headers: { origin },
      body,
    });
  assert.equal((await browserPolicyLookup(request('{}', 'https://elsewhere.test'))).status, 403);
  assert.equal((await browserPolicyLookup(request('{broken'))).status, 400);
  assert.equal((await browserPolicyLookup(request('{"query":""}'))).status, 400);
  const response = await browserPolicyLookup(request('{"query":"return policy"}'));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert(
    data.sources.some(
      (s: { id: string; href: string }) => s.id === 'returns' && s.href.includes('faq'),
    ),
  );
  const absent = await (await browserPolicyLookup(request('{"query":"lunar insurance"}'))).json();
  assert.equal(absent.sources.length, 0);
});
