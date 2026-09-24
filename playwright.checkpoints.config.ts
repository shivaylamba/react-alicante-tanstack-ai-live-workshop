import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/checkpoint-browser',
  workers: 1,
  fullyParallel: false,
  timeout: 90_000,
  use: { baseURL: 'http://localhost:3011', trace: 'retain-on-failure' },
});
