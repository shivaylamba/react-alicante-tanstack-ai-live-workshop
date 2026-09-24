import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  use: { baseURL: 'http://localhost:3010', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run solution -- 12',
    url: 'http://localhost:3010/api/health',
    reuseExistingServer: false,
    env: { WORKSHOP_MOCK: '1', PORT: '3010', WORKSHOP_HMR_PORT: '24679' },
    timeout: 60_000,
  },
});
