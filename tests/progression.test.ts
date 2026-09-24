import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
const targets = [
  ['server.ts'],
  ['Chat.tsx'],
  ['tools.ts'],
  ['Results.tsx'],
  ['compare-server.ts', 'Comparison.tsx'],
  ['tools.ts'],
  ['Chat.tsx'],
  ['server.ts'],
  ['middleware.ts', 'server.ts'],
  ['DebugPanel.tsx'],
  ['WebMCP.tsx'],
  ['agent.ts'],
];
test('each starter differs from its cumulative solution only at the documented exercise boundaries', async () => {
  const names = (await readdir('solutions')).sort();
  assert.equal(names.length, 12);
  assert.deepEqual((await readdir('exercises')).sort(), names);
  let teachingMinutes = 0;
  for (const [index, name] of names.entries()) {
    const starter = join('exercises', name),
      solution = join('solutions', name);
    const files = (await readdir(solution)).sort();
    assert.deepEqual((await readdir(starter)).sort(), files);
    for (const file of files.filter((f) => f !== 'README.md' && !targets[index].includes(f))) {
      assert.equal(
        await readFile(join(starter, file), 'utf8'),
        await readFile(join(solution, file), 'utf8'),
        `${name}/${file} contains an unintended gap`,
      );
    }
    const readme = await readFile(join(starter, 'README.md'), 'utf8');
    const minutes = Number(readme.match(/\n(\d+) minutes:/)?.[1]);
    assert(minutes > 0, name);
    teachingMinutes += minutes;
    for (const file of targets[index]) assert(readme.includes(file), `${name}: document ${file}`);
  }
  assert.equal(teachingMinutes, 200, 'leave 40 minutes for opening, break, capstone and recovery');
});
