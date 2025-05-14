module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['prettier', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    // 'next/core-web-vitals',
  ],
  rules: {
    'no-unused-vars': 'off',

    // Enable the TypeScript version
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        bracketSameLine: false,
        bracketSpacing: true,
        embeddedLanguageFormatting: 'auto',
        htmlWhitespaceSensitivity: 'css',
        insertPragma: false,
        jsxSingleQuote: false,
        proseWrap: 'preserve',
        quoteProps: 'as-needed',
        requirePragma: false,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false,
        vueIndentScriptAndStyle: false,
        printWidth: 100,
        endOfLine: 'auto',
      },
    ],
    'linebreak-style': 'off',
    indent: 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
  ignorePatterns: ['.eslintrc.js'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
};
