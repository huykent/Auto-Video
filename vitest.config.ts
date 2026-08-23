import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    server: {
      deps: {
        external: ['drizzle-orm', '@libsql/client'],
      },
    },
  },
});
