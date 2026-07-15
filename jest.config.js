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
};
