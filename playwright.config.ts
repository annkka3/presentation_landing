import { defineConfig, devices } from '@playwright/test'

const remoteBaseURL = process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: { baseURL: remoteBaseURL ?? 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: remoteBaseURL ? undefined : { command: 'npm run preview -- --host 127.0.0.1', port: 4173, reuseExistingServer: true },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
})
