module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: "./rules/common",
  ignorePatterns: ["tests/*.ts", "**/*.d.ts", "*.js", "*.config.ts", "examples/svelte-vite-project"],
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
