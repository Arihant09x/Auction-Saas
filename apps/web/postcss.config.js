/** @type {import('postcss').Config} */
const config = {
    plugins: {
        tailwindcss: {
            config: "../../packages/ui/tailwind.config.ts",
        },
        autoprefixer: {},
    },
};

export default config;
