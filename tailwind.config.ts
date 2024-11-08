import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";
import plugin from 'tailwindcss/plugin';


const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['var(--font-noto-serif)', 'ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif']
            }
        },
        screens: {
            'sm': '40rem',
            // => @media (min-width: 640px) { ... }

            'md': '48rem',
            // => @media (min-width: 768px) { ... }

            'lg': '64rem',
            // => @media (min-width: 1024px) { ... }

            'xl': '80rem',
            // => @media (min-width: 1280px) { ... }

            '2xl': '90rem',
            // => @media (min-width: 1440px) { ... }
        }
    },
    plugins: [
        nextui({
            layout: {
                disabledOpacity: 1
            },
            themes: {
                light: {
                    colors: {
                        danger: {
                            DEFAULT: '#dc2626', // red-600
                            foreground: '#ffffff'
                        }
                    }
                }
            }
        }),
        plugin(function ({ addUtilities }) {
            addUtilities({
                '.wrap-anywhere': {
                    'overflow-wrap': 'anywhere'
                }
            });
        })
    ]
};
export default config;
