import type { Config } from "tailwindcss";
import {designTokens} from "./src/config/design-tokens";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: designTokens.colors,
            fontFamily: designTokens.typography.fontFamily,
            fontSize: designTokens.typography.fontSize,
            borderRadius: designTokens.borderRadius,
            spacing: designTokens.spacing,
        },
    },
    plugins: [],
}

export default config;