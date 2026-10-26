import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".reference/**",
      ".next-production/**",
      "public/models/draco/**", // Unmodified third-party decoder distribution.
      "src/components/vehicle/**", // Archived VEYRA reference; not imported by the application.
      "apps/api/dist/**",
      "apps/api/src/generated/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...nextVitals,
  ...nextTypeScript,
];

export default config;
