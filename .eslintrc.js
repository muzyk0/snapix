module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      extends: 'standard-with-typescript',
      rules: {
        '@typescript-eslint/space-before-function-paren': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/comma-dangle': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/return-await': 'off',
        // 'no-extra-boolean-cast': 'off',
        '@typescript-eslint/brace-style': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'warn',
        '@typescript-eslint/semi': 'off'
      },
    },
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
}
