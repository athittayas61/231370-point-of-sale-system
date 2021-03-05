module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-unused-vars': [2, {
      args: 'after-used',
      argsIgnorePattern: '^_'
    }],
    '@typescript-eslint/member-delimiter-style': [2, {
      multiline: { delimiter: 'none', requireLast: false },
      singleline: { delimiter: 'semi', requireLast: false },
    }],
  },  
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
