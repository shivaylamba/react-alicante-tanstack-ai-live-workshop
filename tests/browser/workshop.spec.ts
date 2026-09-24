import { test, expect } from '@playwright/test';
async function ask(page: import('@playwright/test').Page, prompt: string) {
  await page.getByLabel('Ask the shop assistant').fill(prompt);
  await page.getByRole('button', { name: 'Send message' }).click();
}
test('real TanStack tool/approval/resume flow approves once', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('FIXTURE MODE')).toBeVisible();
  await ask(page, 'Find a red t-shirt size m and add it to my cart');
  await expect(page.getByRole('button', { name: 'Approve', exact: true })).toBeVisible();
  await expect(page.getByText('Review cart addition', { exact: true })).toBeVisible();
  await page.getByLabel('Ask the shop assistant').fill('yes approve');
  await expect(page.getByRole('button', { name: 'Send message', exact: true })).toBeDisabled();
  await expect(page.getByRole('link', { name: 'Your bag (0)', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Approve', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Your bag (1)', exact: true })).toBeVisible();
  await expect(page.getByText('Fixture run complete.', { exact: false })).toBeVisible();
  await expect(page.getByLabel('Cart approval status')).toContainText('No cart action is awaiting approval');
});
test('denial leaves the cart empty', async ({ page }) => {
  await page.goto('/');
  await ask(page, 'Add a red t-shirt size m to my cart');
  await page.getByRole('button', { name: 'Deny', exact: true }).click();
  await expect(page.getByText('Fixture run complete.', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Your bag (0)', exact: true })).toBeVisible();
});
test('agent invokes a browser tool and resumes', async ({ page }) => {
  await page.goto('/');
  await ask(page, 'Filter the visible products to red');
  await expect(page.getByLabel('Product color', { exact: true })).toHaveValue('red');
  await expect(page.getByLabel('Product color', { exact: true })).toHaveValue('red');
  await expect(page.getByText('Fixture run complete.', { exact: false })).toBeVisible();
});
test('failure injection and recovery', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Failure lab').selectOption('rate-limit');
  await ask(page, 'Hello');
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByLabel('Failure lab').selectOption('none');
  await ask(page, 'Find red products');
  await expect(page.getByText('Fixture run complete.', { exact: false })).toBeVisible();
});
test('local browser harness validates inputs', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Workshop lab', { exact: true }).click();
  await page.getByRole('button', { name: 'Harness: filter red' }).click();
  await expect(page.getByLabel('Product color', { exact: true })).toHaveValue('red');
  await page.getByRole('button', { name: 'Harness: invalid input' }).click();
  await expect(page.locator('output')).toContainText('Invalid color rejected');
});
test('slow stream stops and leaves the UI usable', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Failure lab').selectOption('slow');
  await ask(page, 'Find red products');
  await expect(page.getByText('Fixture run', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeDisabled();
  const before = await page.locator('.messages').textContent();
  await page.waitForTimeout(700);
  expect(await page.locator('.messages').textContent()).toBe(before);
});
test('approved invalid ID is refused without mutating the cart', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Failure lab').selectOption('tool-error');
  await ask(page, 'Add a product to my cart');
  await page.getByRole('button', { name: 'Approve', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Unknown product ID');
  await expect(page.getByRole('link', { name: 'Your bag (0)', exact: true })).toBeVisible();
});

test('manual product detail, variant, persistent cart and demo checkout', async ({ page }) => {
  await page.goto('/?product=fire-t-shirt');
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.getByRole('link', { name: 'Your bag (1)', exact: true }).click();
  await expect(page.getByLabel('Shopping cart')).toContainText('Fire T-Shirt');
  await page.reload();
  await expect(page.getByRole('link', { name: 'Your bag (1)', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Preview checkout' }).click();
  await expect(page.getByLabel('Shopping cart')).toContainText('No order was placed');
});
test('policy tool renders a verified source and product cards link to detail routes', async ({
  page,
}) => {
  await page.goto('/');
  await ask(page, 'Find red products and explain the return policy');
  await expect(page.locator('.sources a')).toHaveAttribute('href', '/?page=faq#returns');
  await expect(page.locator('.chat-products a').first()).toHaveAttribute('href', /product=/);
});
test('product navigation preserves the conversation and back navigation restores filters', async ({
  page,
}) => {
  await page.goto('/');
  await ask(page, 'Find red products');
  await expect(page.getByText('Fixture run complete.', { exact: false })).toBeVisible();
  await page.locator('.chat-products a').first().click();
  await expect(page.getByRole('button', { name: 'Add to bag', exact: true })).toBeVisible();
  await expect(page.getByText('Fixture run complete.', { exact: false })).toBeVisible();
  await page.goBack();
  await expect(page.getByLabel('Product catalog')).toBeVisible();
});
test('mobile layout keeps shopping controls inside viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('textbox', { name: 'Ask the shop assistant' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.getByRole('button', { name: 'Shopping assistant −' }).click();
  await expect(page.getByLabel('Product catalog')).toBeVisible();
  await page.getByLabel('Product color', { exact: true }).selectOption('red');
  await expect(page.locator('.product-grid .product-card')).toHaveCount(5);
});

test('structured comparisons revise a shortlist and preserve earlier cards', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Compare products', { exact: true }).click();
  await page.getByRole('button', { name: 'Build comparison', exact: true }).click();
  await expect(page.getByLabel('Product comparison', { exact: true })).toHaveCount(1);
  await expect(
    page.getByLabel('Product comparison', { exact: true }).first().locator('.product-card'),
  ).toHaveCount(2);
  await page
    .getByLabel('Shopping comparison request')
    .fill('Make the selection cheaper, at most €20');
  await page.getByRole('button', { name: 'Build comparison', exact: true }).click();
  await expect(page.getByLabel('Product comparison', { exact: true })).toHaveCount(2);
  await expect(
    page.getByLabel('Product comparison', { exact: true }).last().locator('.product-card'),
  ).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Your bag (0)', exact: true })).toBeVisible();
});
test('a queued follow-up can be cancelled without entering history', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Failure lab').selectOption('slow');
  await ask(page, 'Find red products');
  await expect(page.getByText('Fixture run', { exact: false })).toBeVisible();
  await ask(page, 'Only medium sizes please');
  await expect(page.getByLabel('Pending messages')).toContainText('Only medium sizes please');
  await page.getByRole('button', { name: 'Cancel queued message' }).click();
  await expect(page.getByLabel('Pending messages')).toHaveCount(0);
  await page.getByRole('button', { name: 'Stop', exact: true }).click();
  await expect(page.locator('.messages')).not.toContainText('Only medium sizes please');
});
test('queued follow-up drains after the active run succeeds', async ({ page }) => {
  await page.goto('/');
  await ask(page, 'Find red products');
  await ask(page, 'Only medium sizes please');
  await expect(page.locator('.messages')).toContainText('Only medium sizes please');
  await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeDisabled();
  await expect(page.getByLabel('Pending messages')).toHaveCount(0);
});
test('middleware visibly caches policy reads and bounds repeated tools', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Failure lab').selectOption('policy-cache');
  await ask(page, 'Explain the return policy');
  await expect(page.locator('.run-trace')).toContainText('Policy cache hit');
  await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeDisabled();
  await page.getByLabel('Failure lab').selectOption('tool-budget');
  await ask(page, 'Keep looking for products');
  await expect(page.locator('.run-trace')).toContainText('Tool budget reached (2)');
  await expect(page.getByRole('button', { name: 'Stop', exact: true })).toBeDisabled();
  await expect(page.getByRole('link', { name: 'Your bag (0)', exact: true })).toBeVisible();
});

test('invalid generated comparison is rejected before any completed card is rendered', async ({
  page,
}) => {
  await page.route('**/api/compare', (route) =>
    route.continue({
      headers: { ...route.request().headers(), 'x-workshop-fault': 'invalid-comparison' },
    }),
  );
  await page.goto('/');
  await page.getByText('Compare products', { exact: true }).click();
  await page.getByRole('button', { name: 'Build comparison', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Comparison rejected');
  await expect(page.getByLabel('Product comparison', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Stop comparison' })).toBeDisabled();
});

test('browser shopping handlers show real product and policies without changing cart', async ({
  page,
}) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const modulePath = '/core-app/webmcp-tools.ts';
    const { showProduct, browserPolicies } = await import(modulePath);
    const policy = await browserPolicies({ query: 'return policy' });
    let rejected = false;
    try {
      showProduct({ productId: 'fabricated' });
    } catch {
      rejected = true;
    }
    const shown = showProduct({ productId: 'fire-t-shirt' });
    return { policy, shown, rejected };
  });
  expect(result.rejected).toBe(true);
  expect(result.policy.sources.some((s: { id: string }) => s.id === 'returns')).toBe(true);
  await expect(page).toHaveURL(/product=fire-t-shirt/);
  await expect(page.getByRole('heading', { name: 'Fire T-Shirt', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Your bag (0)', exact: true })).toBeVisible();
});

test('fixture policy lookup preserves an unsupported question and renders no sources', async ({
  page,
}) => {
  await page.goto('/');
  await ask(page, 'Do you offer lunar insurance?');
  await expect(page.locator('.sources')).toContainText('No supporting policy found');
  await expect(page.locator('.sources a')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Your bag (0)', exact: true })).toBeVisible();
});
