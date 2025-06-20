import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    languageOptions: { globals: {...globals.browser, ...globals.node}} 
  },
  ...tseslint.configs.strict,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_"
      }],
			"@typescript-eslint/no-duplicate-imports": ["error", {
				"includeExports": true
			}],
			"@/capitalized-comments": ["error", "never"],
			"@/eqeqeq": ["error", "always", {"null": "ignore"}],
			"@/no-var": ["error"],
			"@/prefer-const": ["error"],
			"@/require-await": ["error"]
    }
  }
]);
