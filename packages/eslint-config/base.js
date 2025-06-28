import globals from "globals";
import tseslint from "typescript-eslint";

export const baseConfig = [
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
			"@/no-duplicate-imports": ["error", {
				"includeExports": true
			}],
			"@/capitalized-comments": ["warn", "never"],
			"@/eqeqeq": ["error", "always", {"null": "ignore"}],
			"@/no-var": ["error"],
			"@/prefer-const": ["error"],
			"@/require-await": ["error"],
      "@/semi": ["error", "never"],
			"@/no-trailing-spaces": ["warn"],
      "@typescript-eslint/no-explicit-any": "warn"
    },
  },
  {
  	ignores: ["dist/*", "node_modules/*", "*.mjs"]
  }

];
