module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@exmpl/(.*)": "<rootDir>/src/$1"
  },
  testPathIgnorePatterns: [
    "/client/"
  ],
  testTimeout: 30000
};