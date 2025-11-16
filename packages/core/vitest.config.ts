import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    reporters: process.env.GITHUB_ACTIONS ? ["default", "github-actions"] : ["default"],
  },
});
