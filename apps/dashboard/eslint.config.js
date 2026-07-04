import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

/** @type {import("eslint").Linter.Config} */
const config = [
    ...compat.config({
        extends: ["@repo/eslint-config/next.js"],
        rules: {
            "@next/next/no-html-link-for-pages": "off",
        },
    }),
];

export default config;
