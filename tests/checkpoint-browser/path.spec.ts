import { test, expect } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
import { readdirSync } from 'node:fs';
const names = readdirSync('solutions').sort();
let server: ChildProcess;
test.describe.configure({ mode: 'serial' });
test.afterEach(async () => {
  if (server && server.exitCode === null && server.signalCode === null) {
    await new Promise<void>((resolve) => {
      const timer = setTimeout(() => {
        server.kill('SIGKILL');
        resolve();
      }, 3000);
      server.once('exit', () => {
        clearTimeout(timer);
        resolve();
      });
      server.kill('SIGTERM');
    });
  }
});
for (const [i, name] of names.entries())
  test(`completed checkpoint ${name}`, async ({ page, request }) => {
    let logs = '';
    server = spawn(process.execPath, ['--import', 'tsx', 'core-app/server.ts'], {
      env: {
        ...process.env,
        WORKSHOP_LESSON: `solutions/${name}`,
        WORKSHOP_MOCK: '1',
        PORT: '3011',
        WORKSHOP_HMR_PORT: '24680',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    server.stdout?.on('data', (b) => (logs += b));
    server.stderr?.on('data', (b) => (logs += b));
    await expect
      .poll(
        async () => {
          try {
            return (await (await request.get('/api/health')).json()).lesson;
          } catch {
            return logs.includes('EADDRINUSE') ? 'PORT CONFLICT' : '';
          }
        },
        { timeout: 30000 },
      )
      .toBe(`solutions/${name}`);
    await page.goto('/');
    const ask = async (prompt: string) => {
      await page.getByLabel('Ask the shop assistant').fill(prompt);
      await page.getByRole('button', { name: 'Send message', exact: true }).click();
    };
    if (i === 0) {
      await expect(
        page.getByText('Exercise 01 connects the server.', { exact: false }),
      ).toBeVisible();
      const r = await request.post('/api/chat', {
        data: {
          threadId: 'test',
          runId: crypto.randomUUID(),
          messages: [{ id: 'm1', role: 'user', content: 'Hello' }],
          tools: [],
          context: [],
        },
      });
      expect(r.headers()['content-type']).toContain('text/event-stream');
      expect(await r.text()).toContain('RUN_FINISHED');
      const bad = await request.post('/api/chat', { data: { messages: 'invalid' } });
      expect(bad.status()).toBe(400);
    } else if (i === 1) {
      await page.getByLabel('Failure lab').selectOption('slow');
      await ask('Explain streaming');
      await expect(page.getByText('Fixture response:', { exact: false })).toBeVisible();
      await ask('Second message');
      await expect(page.getByText('Waiting to send', { exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Cancel queued message' }).click();
      await expect(page.getByText('Waiting to send', { exact: true })).toHaveCount(0);
      await page.getByRole('button', { name: 'Stop', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeDisabled();
    } else if (i === 2) {
      await ask('Find red T-shirts');
      await expect(page.getByText('Tool: search_products', { exact: false })).toBeVisible();
      await expect(page.locator('.chat-products')).toHaveCount(0);
    } else if (i === 3) {
      await ask('Find red T-shirts');
      await expect(page.locator('.chat-products a').first()).toBeVisible();
    } else if (i === 4) {
      await page.getByText('Compare products', { exact: true }).click();
      await page.getByRole('button', { name: 'Build comparison' }).click();
      await expect(page.getByLabel('Comparison history')).toContainText('Fire T-Shirt');
    } else if (i === 5) {
      await ask('What is the return policy?');
      await expect(page.locator('.sources a')).toHaveAttribute('href', '/?page=faq#returns');
    } else if (i === 6) {
      await ask('Add one Fire T-Shirt red size m to my cart');
      await page.getByRole('button', { name: 'Deny', exact: true }).click();
      await expect(page.getByText('Fixture run complete.', { exact: false })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Your bag (0)', exact: true })).toBeVisible();
      await page.reload();
      await ask('Add one Fire T-Shirt red size m to my cart');
      await page.getByRole('button', { name: 'Approve', exact: true }).click();
      await expect(page.getByRole('link', { name: 'Your bag (1)', exact: true })).toBeVisible();
    } else if (i === 7) {
      await ask('Filter the visible products to red');
      await expect(page.getByLabel('Product color', { exact: true })).toHaveValue('red');
    } else if (i === 8) {
      await page.getByLabel('Failure lab').selectOption('tool-budget');
      await ask('Find products');
      await expect(
        page.getByText('Tool budget reached (2)', { exact: false }).first(),
      ).toBeVisible();
    } else if (i === 9) {
      await ask('Find products');
      await expect(page.getByText('Fixture run complete.', { exact: false })).toBeVisible();
      await page.getByRole('button', { name: 'Open TanStack Devtools', exact: true }).click();
      await expect(page.getByText('TanStack AI', { exact: true }).first()).toBeVisible();
    } else if (i === 10) {
      await page.getByText('Workshop lab', { exact: true }).click();
      await page.getByRole('button', { name: 'Harness: filter red' }).click();
      await expect(page.getByLabel('Product color', { exact: true })).toHaveValue('red');
      await page.getByRole('button', { name: 'Harness: invalid input' }).click();
      await expect(page.locator('output')).toContainText('Invalid color rejected');
    } else {
      await page.goto('/agent.html');
      await expect(page.locator('body')).toContainText('WebMCP');
    }
  });
