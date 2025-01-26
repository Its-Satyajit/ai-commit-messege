export default [{
  files: ["**/*.ts"],
  plugins: {
    "@typescript-eslint": typescriptEslint,
  },
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/naming-convention": ["warn", {
      selector: "import",
      format: ["camelCase", "PascalCase"],
    }],
    curly: ["warn", "all"],
    eqeqeq: "warn",
    "no-throw-literal": "warn",
    semi: "warn",
  },
}];
