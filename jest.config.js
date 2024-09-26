/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"], // Matching test files with the .test.ts suffix
  moduleFileExtensions: ["ts", "js"], // Recognizing .ts and .js extensions for modules
  globals: {
    "ts-jest": {
      isolatedModules: true, // Optional: speeds up compilation for simple test cases
    },
  },
};
