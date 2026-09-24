import { spawn } from 'node:child_process';
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
const [kind, raw = '12'] = process.argv.slice(2);
const n = Number(raw);
if (!['exercises', 'solutions'].includes(kind) || !Number.isInteger(n) || n < 1 || n > 12) {
  console.error('Usage: npm run exercise -- 01 (or solution; 01–12)');
  process.exit(1);
}
const lesson = `${kind}/${String(n).padStart(2, '0')}-${names[n - 1]}`;
console.log(`Opening ${lesson}. Edits stay in that folder. Ctrl-C before switching checkpoints.`);
const child = spawn(process.execPath, ['--import', 'tsx', 'core-app/server.ts'], {
  stdio: 'inherit',
  env: { ...process.env, WORKSHOP_LESSON: lesson },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
child.on('exit', (code) => process.exit(code ?? 1));
