import js from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import pluginTurbo from "eslint-plugin-turbo";
import pluginImport from "eslint-plugin-import";
import pluginTailwindcss from "eslint-plugin-tailwindcss";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
  js.configs.recommended,
  configPrettier,
  ...tseslint.configs.recommended,
  ...pluginTailwindcss.configs["flat/recommended"],
  pluginJsxA11y.flatConfigs.recommended,
  {
    plugins: {
      turbo: pluginTurbo,
      import: pluginImport,
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn", // or "error"
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "turbo/no-undeclared-env-vars": "warn",
      "import/order": [
        "warn",
        {
          groups: [
            "type",
            "builtin",
            "object",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "~/**",
              group: "external",
              position: "after",
            },
          ],
          "newlines-between": "always",
        },
      ],
    },
  },
  {
    ignores: ["dist/**"],
  },
];
