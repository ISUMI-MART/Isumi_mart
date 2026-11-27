// // @ts-check
// import { defineConfig, devices } from '@playwright/test';

// export default defineConfig({
//   testDir: './tests',

//   fullyParallel: true,

//   forbidOnly: !!process.env.CI,

//   retries: process.env.CI ? 2 : 0,

//   workers: process.env.CI ? 1 : undefined,

//   reporter: 'html',

//   use: {
//     baseURL: 'http://localhost:5174',
//     trace: 'on-first-retry',
//   },

//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },

//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'] },
//     },

//     {
//       name: 'webkit',
//       use: { ...devices['Desktop Safari'] },
//     },
//   ],

//   webServer: {
//     command: 'npm run dev',
//     url: 'http://localhost:5174',
//     cwd: 'C:\\Users\\hirun\\Isumi_mart\\frontend',
//     reuseExistingServer: !process.env.CI,
//   },
// });
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },

    projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    cwd: './frontend',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});