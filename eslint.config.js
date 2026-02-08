import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...svelte.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
  {
    ignores: ["node_modules/**", ".svelte-kit/**", "build/**", "dist/**"],
  },
];
