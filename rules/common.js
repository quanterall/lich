module.exports = {
  overrides: [
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: __dirname + "/tsconfig.json",
      },
      plugins: [
        "eslint-plugin-prefer-arrow",
        "eslint-plugin-jsdoc",
        "@typescript-eslint",
        "@typescript-eslint/tslint",
      ],
      rules: {
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/array-type": [
          "error",
          {
            default: "array",
          },
        ],
        "@typescript-eslint/ban-types": [
          "error",
          {
            types: {
              Object: {
                message: "Avoid using the `Object` type. Did you mean `object`?",
              },
              Function: {
                message:
                  "Avoid using the `Function` type. Prefer a specific function type, like `() => void`.",
              },
              Boolean: {
                message: "Avoid using the `Boolean` type. Did you mean `boolean`?",
              },
              Number: {
                message: "Avoid using the `Number` type. Did you mean `number`?",
              },
              String: {
                message: "Avoid using the `String` type. Did you mean `string`?",
              },
              Symbol: {
                message: "Avoid using the `Symbol` type. Did you mean `symbol`?",
              },
            },
          },
        ],
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/dot-notation": "error",
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: "default",
            format: ["camelCase"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
          },
          {
            selector: "variable",
            format: ["camelCase", "UPPER_CASE"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
          },
          {
            selector: "typeLike",
            format: ["PascalCase"],
          },
          {
            selector: ["memberLike"],
            format: ["camelCase"],
          },
          {
            selector: "function",
            format: ["camelCase", "PascalCase"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
          },
        ],
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/no-empty-interface": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-shadow": [
          "error",
          {
            hoist: "all",
          },
        ],
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/strict-boolean-expressions": "error",
        "@typescript-eslint/triple-slash-reference": [
          "error",
          {
            path: "always",
            types: "prefer-import",
            lib: "always",
          },
        ],
        "@typescript-eslint/unified-signatures": "error",
        "arrow-parens": ["error", "always"],
        "comma-dangle": ["error", "always-multiline"],
        complexity: "off",
        "constructor-super": "error",
        "dot-notation": "error",
        eqeqeq: ["error", "smart"],
        "guard-for-in": "error",
        "id-blacklist": [
          "error",
          "any",
          "Number",
          "number",
          "String",
          "string",
          "Boolean",
          "boolean",
          "Undefined",
          "undefined",
        ],
        "id-match": "error",
        "jsdoc/check-alignment": "error",
        "jsdoc/check-indentation": "error",
        "jsdoc/newline-after-description": "error",
        "max-classes-per-file": ["error", 1],
        "max-len": [
          "error",
          {
            code: 102,
          },
        ],
        "new-parens": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-cond-assign": "error",
        "no-console": "off",
        "no-debugger": "error",
        "no-empty": "error",
        "no-empty-function": "error",
        "no-eval": "error",
        "no-fallthrough": "off",
        "no-invalid-this": "off",
        "no-new-wrappers": "error",
        "no-shadow": "error",
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "error",
        "no-unsafe-finally": "error",
        "@typescript-eslint/no-unsafe-assignment": "error",
        "@typescript-eslint/no-unsafe-argument": "error",
        "no-unused-expressions": "error",
        "no-unused-labels": "error",
        "no-unused-vars": ["error", { args: "all", argsIgnorePattern: "^_" }],
        "no-use-before-define": "off",
        "no-var": "error",
        "object-shorthand": "error",
        "one-var": ["error", "never"],
        "padding-line-between-statements": [
          "error",
          {
            blankLine: "always",
            prev: "*",
            next: "return",
          },
        ],
        "prefer-arrow/prefer-arrow-functions": "off",
        "prefer-const": "error",
        radix: "error",
        "spaced-comment": [
          "error",
          "always",
          {
            markers: ["/"],
          },
        ],
        "use-isnan": "error",
        "valid-typeof": "off",
        "@typescript-eslint/tslint/config": [
          "error",
          {
            rules: {
              typedef: [true, "call-signature"],
            },
          },
        ],
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
    },
  ],
};
