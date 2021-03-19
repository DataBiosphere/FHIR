module.exports = {
  extends: [
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  env: {
    jest: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  rules: {
    'arrow-body-style': 'off',
    'object-curly-newline': 'off',
    'operator-linebreak': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/jsx-filename-extension': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'warn',
    'import/no-named-as-default': 'off',
    'react/static-property-placement': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'no-unused-vars': 'warn',
    'react/no-children-prop': 'warn',

    'no-console': 'warn', // we don't want to ship with console logs
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
