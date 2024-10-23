import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ['storage'],
    host_permissions: ['*://*.twitter.com/*', '*://*.x.com/*', '*://x.com/*'],
  },
});
