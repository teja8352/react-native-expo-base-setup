const expo = require("eslint-config-expo/flat");
const prettier = require("eslint-config-prettier");
const simpleImportSort = require("eslint-plugin-simple-import-sort");

module.exports = [
  { ignores: ["node_modules/**", ".expo/**", "dist/**", "coverage/**"] },
  ...expo,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  prettier,
];
