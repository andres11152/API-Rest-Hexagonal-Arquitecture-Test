/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Esta sección le enseña a Jest a resolver los alias de ruta.
  // Le decimos que cada vez que vea un import que empieza con '@/(.*)',
  // debe buscarlo en '<rootDir>/src/$1'.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};