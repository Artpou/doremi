import js from "@eslint/js";
import configPrettier from "eslint-config-prettier";

/** @type {import("eslint").Linter.Config} */
export default [
  js.configs.recommended,
  configPrettier,
  {
    rules: {
      "no-console": "warn"
    },
    ignores: ["dist/**"]
  }
]; 