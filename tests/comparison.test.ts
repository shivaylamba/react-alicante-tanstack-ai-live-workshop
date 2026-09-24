import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateComparison } from '../core-app/comparison-schema';
const valid = {
  title: 'Shortlist',
  recommendations: [{ productId: 'fire-t-shirt', reason: 'Red option' }],
  followUpQuestion: 'Which size?',
};
test('comparison rejects fabricated IDs, duplicates, extra prices and missing retrieval evidence', () => {
  assert.deepEqual(validateComparison(valid, new Set(['fire-t-shirt'])), valid);
  assert.throws(() =>
    validateComparison({ ...valid, recommendations: [{ productId: 'invented', reason: 'x' }] }),
  );
  assert.throws(() =>
    validateComparison({
      ...valid,
      recommendations: [...valid.recommendations, ...valid.recommendations],
    }),
  );
  assert.throws(() => validateComparison({ ...valid, price: 1 }));
  assert.throws(() => validateComparison(valid, new Set()));
  assert.equal(
    validateComparison({ ...valid, recommendations: [] }, new Set()).recommendations.length,
    0,
  );
});
