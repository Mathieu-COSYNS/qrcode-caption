import prettierConfig from "@acme/prettier-config";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config | import("prettier-plugin-tailwindcss").PluginOptions}
 */
const config = {
  ...prettierConfig,
  tailwindStylesheet: "./src/styles/global.css",
};

export default config;
