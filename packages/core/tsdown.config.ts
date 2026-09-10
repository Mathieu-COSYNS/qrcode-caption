import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    minify: false,
    outExtensions: ({ format }) => {
      if (format === "es") return { js: ".js" };
    },
  },
  {
    entry: { bundle: "src/index.ts" },
    format: ["iife"],
    globalName: "QRCodeCaption",
    deps: {
      alwaysBundle: [/.*/],
      onlyBundle: ["qrcode", "mini-svg-data-uri", "dijkstrajs"],
    },
    minify: true,
    outputOptions: {
      entryFileNames: "[name].min.js",
    },
  },
]);
