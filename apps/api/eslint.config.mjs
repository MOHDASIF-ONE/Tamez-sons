import base from "../../eslint.config.mjs";

const config = [
  ...base,
  { rules: { "@next/next/no-html-link-for-pages": "off" } },
];

export default config;
