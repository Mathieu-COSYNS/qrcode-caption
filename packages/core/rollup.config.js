/* eslint-disable import/no-named-as-default */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

/** @type {import('rollup').RollupOptions[]} */
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.min.js',
        format: 'iife',
        name: 'QRCodeCaption',
      },
    ],
    plugins: [
      typescript(),
      commonjs(),
      resolve(),
      babel({
        exclude: ['../../node_modules/**', './node_modules/**'],
        babelHelpers: 'bundled',
        babelrc: false,
        presets: [['@babel/preset-env']],
      }),
      terser(),
    ],
    onwarn: function (warning, warner) {
      if (warning.code === 'CIRCULAR_DEPENDENCY') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        if (warning.importer?.startsWith('node_modules/')) {
          return;
        }
      }
      warner(warning);
    },
  },
];
