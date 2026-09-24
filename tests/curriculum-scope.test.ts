import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
test('early endpoints and clients contain only capabilities introduced so far', async () => {
  for (const kind of ['exercises', 'solutions'])
    for (const [i, name] of (await readdir(kind)).sort().entries()) {
      const server = await readFile(`${kind}/${name}/server.ts`, 'utf8');
      if (i < 7)
        assert(
          !server.includes('agentLoopStrategy') && !server.includes('maxIterations'),
          `${kind}/${name}: premature loop policy`,
        );
      if (i < 2)
        assert(
          !/search_products|search_store_policies|add_to_cart|filter_products|tools,/.test(server),
          `${name}: premature tools`,
        );
      if (i < 5)
        assert(
          !/search_store_policies|add_to_cart|filter_products/.test(server),
          `${name}: premature policy or mutation`,
        );
      if (i < 6) {
        const client = await readFile(`${kind}/${name}/Chat.tsx`, 'utf8');
        assert(
          !/resolveInterrupt|cartDef|addToCart|interrupts/.test(client),
          `${name}: premature approval`,
        );
      }
    }
});
