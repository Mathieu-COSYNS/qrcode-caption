import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.umd.min.js',
        format: 'umd',
        name: 'QRCodeCaption',
      },
      {
        file: 'dist/bundle.esm.min.js',
        format: 'es',
      },
    ],
    plugins: [
      typescript(),
      commonjs(),
      resolve(),
      eslint({
        fix: true,
        exclude: ['./node_modules/**', './src/styles/**'],
      }),
      babel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        babelrc: false,
        presets: [['@babel/preset-env']],
      }),
      terser(),
    ],
    onwarn: function (warning, warner) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        if (warning.importer && warning.importer.startsWith('node_modules/')) {
          return;
        }
      }
      warner(warning);
    },
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/qrcode-caption.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
