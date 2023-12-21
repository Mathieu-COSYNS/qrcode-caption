import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    minify: false,
    splitting: false,
    clean: true,
  },
  {
    entry: { bundle: 'src/index.ts' },
    format: ['iife'],
    minify: 'terser',
    splitting: false,
    clean: true,
    globalName: 'QRCodeCaption',
    outExtension() {
      return {
        js: `.min.js`,
      };
    },
  },
]);
