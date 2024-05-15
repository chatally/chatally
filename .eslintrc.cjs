// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require("node:path");
const project = resolve(process.cwd(), "tsconfig.json");
console.log({ project });

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "eslint-config-turbo",
  ],
  plugins: ["only-warn", "@typescript-eslint"],
  env: {
    node: true,
    es6: true,
  },
  globals: {
    // vitest/globals
    describe: true,
    it: true,
    expect: true,
    assert: true,
  },
  settings: {
    "import/resolver": {
      typescript: { project },
    },
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
  },
  ignorePatterns: [
    // Ignore dotfiles
    // ".*.c?js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
};
