module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: "./rules/common",
  ignorePatterns: ["tests/*.ts", "**/*.d.ts", "*.js", "*.config.ts"],
  overrides: [
    {
      files: ["**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: __dirname + "/tsconfig.json",
      },
    },
  ],
};
