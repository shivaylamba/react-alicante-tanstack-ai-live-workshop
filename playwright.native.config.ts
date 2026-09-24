import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/native-browser',
  workers: 1,
  fullyParallel: false,
  timeout: 120000,
  use: {
    channel: 'chrome',
    headless: true,
    baseURL: 'http://localhost:3013',
    launchOptions: { args: ['--enable-features=WebMCP'] },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run solution -- 12',
    url: 'http://localhost:3013/api/health',
    reuseExistingServer: false,
    env: { WORKSHOP_MOCK: '0', PORT: '3013', WORKSHOP_HMR_PORT: '24681' },
    timeout: 30000,
  },
});
