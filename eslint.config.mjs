import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
      
      // --- Project Rules Implementation ---
      // 1. Strict Typing
      "@typescript-eslint/no-explicit-any": "error",
      
      // 2. Code Quality & Complexity
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "max-depth": ["warn", 3],
      // Target is 20, but we set warn at 50 to avoid noise on existing code
      "max-lines-per-function": ["warn", { 
        "max": 50, 
        "skipBlankLines": true, 
        "skipComments": true,
        "IIFEs": true
      }],
      
      // 3. Best Practices
      "react/no-unescaped-entities": "off", // Often false positives with apostrophes
    },
  },
  prettierConfig,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
