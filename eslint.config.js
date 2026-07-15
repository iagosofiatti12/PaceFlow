// Configuração do ESLint no formato novo ("flat config", padrão do ESLint 9).
// eslint-config-expo já traz as regras recomendadas para TypeScript,
// React e React Native; eslint-config-prettier desliga as regras de
// formatação que conflitariam com o Prettier.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    ignores: ['dist/*', '.expo/*', 'coverage/*'],
  },
]);
