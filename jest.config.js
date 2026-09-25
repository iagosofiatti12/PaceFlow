module.exports = {
  // jest-expo já configura transforms, mocks dos módulos nativos do Expo
  // e os transformIgnorePatterns necessários — sem gambiarras manuais
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.test.(js|ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  // Piso de cobertura para a lógica pura: se um PR baixar a cobertura dessas
  // pastas abaixo disso, `npm run test:coverage` (e o CI) falha.
  // Os componentes ainda não têm testes (Fase 5 do docs/AUDITORIA.md),
  // por isso o piso vale só para a lógica por enquanto.
  coverageThreshold: {
    './src/domain/': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/format/': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/validation/': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/hooks/': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/utils/historySchema.ts': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/utils/storage.ts': { branches: 85, functions: 85, lines: 85, statements: 85 },
  },
};
