import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment:"node",
    testTimeout: 120000,
    hookTimeout: 60000,
    threads: false,
    maxThreads: 1
  },
})