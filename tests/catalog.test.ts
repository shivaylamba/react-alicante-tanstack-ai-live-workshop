import { test } from 'node:test';
import assert from 'node:assert/strict';
import { searchProducts, getProduct } from '../core-app/catalog';
import {
  addToCart,
  resetStore,
  filterProducts,
  snapshot,
  validateCart,
} from '../core-app/browser-state';
import { retrievePolicies } from '../core-app/retrieval';
test('catalog enforces combined budget, color, size and availability constraints', () => {
  const found = searchProducts({
    query: 't-shirt',
    color: 'red',
    size: 'm',
    maxPrice: 30,
    availableOnly: true,
  });
  assert(found.some((p) => p.id === 'fire-t-shirt'));
  assert(
    found.every(
      (p) =>
        p.priceCents <= 3000 && p.available && p.colors.includes('red') && p.sizes.includes('m'),
    ),
  );
  assert.equal(searchProducts({ query: 'no-such-product' }).length, 0);
  assert.throws(() => getProduct('invented'), /Unknown/);
});
test('cart validates variants and limits, applies approved request once', () => {
  resetStore();
  const args = {
    productId: 'fire-t-shirt',
    color: 'red',
    size: 'm',
    quantity: 1,
    requestId: 'approved-1',
  };
  assert.throws(() => addToCart({ ...args, productId: 'invented' }), /Unknown/);
  assert.throws(() => validateCart({ ...args, size: 'xxxl' }), /variant/);
  assert.equal(addToCart(args).added, true);
  assert.equal(addToCart(args).added, false);
  assert.equal(snapshot().cart[0].quantity, 1);
  assert.throws(() => addToCart({ ...args, requestId: 'other', quantity: 10 }), /Maximum/);
  assert.equal(snapshot().cart[0].quantity, 1);
  resetStore();
});
test('browser filter rejects invalid input without changing state', () => {
  filterProducts({ color: 'red' });
  const before = snapshot();
  assert.throws(() => filterProducts({ color: 'hacked' }));
  assert.equal(snapshot(), before);
});
test('retrieval returns verifiable policy sources and abstains for unsupported topics', async () => {
  process.env.RETRIEVAL_MODE = 'lexical';
  const found = await retrievePolicies('What is your return policy?');
  assert.equal(found.sources[0].id, 'returns');
  assert.equal(found.mode, 'lexical');
  assert.deepEqual((await retrievePolicies('Do you insure lunar expeditions?')).sources, []);
});
