import { test, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
test('installed Chrome: native discovery, Nebius selection and page update', async ({
  page,
  browser,
}, testInfo) => {
  await page.goto('/agent.html');
  await expect(page.locator('#status')).toContainText('Ready. Native shopping tools discovered.', {
    timeout: 20000,
  });
  await page
    .locator('#prompt')
    .fill(
      'Find a red medium T-shirt under €30, check its return policy, and show the best matching product. Leave my bag unchanged.',
    );
  await page.locator('#run').click();
  await expect(page.locator('#status')).toContainText('Complete', { timeout: 110000 });
  const trace = await page.locator('#trace').innerText();
  expect(trace).toContain('Native registry');
  expect(trace).toMatch(/Native execution result\s+\{\s+"name": "search_store_policies"/);
  expect(trace).toMatch(/Native execution result\s+\{\s+"name": "show_product"/);
  const shop = page.frameLocator('#workshop');
  await expect(shop.getByRole('button', { name: 'Add to bag', exact: true })).toBeVisible();
  await expect(shop.getByRole('link', { name: 'Your bag (0)', exact: true })).toBeVisible();
  await writeFile(
    testInfo.outputPath('native-webmcp.json'),
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        browser: browser.version(),
        mode: 'installed Chrome, isolated headless profile, native WebMCP enabled',
        scope:
          'Native registry plus real Nebius model-selected tool execution and rendered product page; bag unchanged',
        trace,
      },
      null,
      2,
    ) + '\n',
  );
});
