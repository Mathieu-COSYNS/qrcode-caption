import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'iife',
      name: 'QRCodeCaption',
      sourcemap: 'inline',
    },
    {
      file: 'dist/bundle.min.js',
      format: 'iife',
      name: 'QRCodeCaption',
      plugins: [terser()],
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
  ],
  onwarn: function (warning, warner) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      if (warning.importer && warning.importer.startsWith('node_modules/')) {
        return;
      }
    }
    warner(warning);
  },
};
