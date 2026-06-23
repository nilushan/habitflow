import next from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "drizzle/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...next,
];

export default eslintConfig;
