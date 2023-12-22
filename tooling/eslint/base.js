module.exports = {
  root: true,
  env: { node: true, es2020: true },
  extends: [
    'turbo',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  rules: {
    'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  reportUnusedDisableDirectives: true,
};
