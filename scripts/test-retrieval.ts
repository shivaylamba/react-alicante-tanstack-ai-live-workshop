import assert from 'node:assert/strict';
import { semanticSearch } from '../core-app/semantic';
assert.equal(
  (await semanticSearch('Can I send back something that does not fit?'))[0]?.id,
  'returns',
);
assert.equal((await semanticSearch('When will my package arrive?'))[0]?.id, 'shipping');
assert.deepEqual(await semanticSearch('Do you insure lunar expeditions?'), []);
console.log('PASS: semantic paraphrases find correct sources; unrelated query abstains.');
