import '../scripts/env';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { createServer as createViteServer } from 'vite';
import { Hono } from 'hono';
import { getRequestListener } from '@hono/node-server';
import { ServerEventBus } from '@tanstack/devtools-event-bus/server';
process.env.NODE_ENV ??= 'development';
const lesson = process.env.WORKSHOP_LESSON ?? 'solutions/12-external-agent';
if (process.env.WORKSHOP_MOCK === '1') {
  const { startMockProvider } = await import('./mocks/provider');
  await startMockProvider();
}
const bus = new ServerEventBus();
await bus.start();
const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
const api = new Hono();
api.get('/api/health', (c) =>
  c.json({
    lesson,
    mode: process.env.WORKSHOP_MOCK === '1' ? 'mock' : 'nebius',
    model: process.env.NEBIUS_MODEL ?? 'zai-org/GLM-5.3-Flash',
  }),
);
api.post('/api/browser-policies', async (c) => {
  const module = await vite.ssrLoadModule(resolve('core-app/browser-policy-api.ts'));
  return module.browserPolicyLookup(c.req.raw);
});
api.post('/api/external-agent', async (c) => {
  try {
    const module = await vite.ssrLoadModule(resolve('core-app/external-agent-api.ts'));
    return await module.externalAgentStep(c.req.raw);
  } catch {
    return c.json({ error: 'External agent request failed' }, 500);
  }
});
api.post('/api/compare', async (c) => {
  const origin = c.req.header('origin');
  if (origin && origin !== new URL(c.req.url).origin)
    return c.json({ error: 'Origin rejected' }, 403);
  try {
    const module = await vite.ssrLoadModule(resolve(lesson, 'compare-server.ts'));
    return await module.POST(c.req.raw);
  } catch (error) {
    console.error('Comparison failed:', error instanceof Error ? error.message : 'Unknown error');
    return c.json({ error: 'Comparison failed. Check server output and provider support.' }, 400);
  }
});
api.post('/api/chat', async (c) => {
  const origin = c.req.header('origin');
  if (origin && origin !== new URL(c.req.url).origin)
    return c.json({ error: 'Origin rejected' }, 403);
  if (Number(c.req.header('content-length') ?? 0) > 80_000)
    return c.json({ error: 'Request too large' }, 413);
  try {
    const module = await vite.ssrLoadModule(resolve(lesson, 'server.ts'));
    return await module.POST(c.req.raw);
  } catch (error) {
    console.error('Chat request failed:', error instanceof Error ? error.message : 'Unknown error');
    return c.json(
      { error: 'Chat request failed. Check server output, key, model, and request format.' },
      400,
    );
  }
});
const listener = getRequestListener(api.fetch);
createServer((req, res) => {
  if (req.url?.startsWith('/api/')) void listener(req, res);
  else vite.middlewares(req, res);
}).listen(Number(process.env.PORT ?? 3000), '127.0.0.1', () =>
  console.log(`Workshop: http://localhost:${process.env.PORT ?? 3000} · ${lesson}`),
);
