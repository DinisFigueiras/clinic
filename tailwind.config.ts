import type { Config } from "tailwindcss";

/**
 * Tailwind CSS configuration for clinic management system
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom color palette for clinic theme
      colors:{
        blue:'#6fb5ff',
        blueLight:'#afd6ff',
        blueSkyLight:'#e6f3ff',
        peach:'#FFB96F',
        peachLight:'#ffce99',
        neutral:'#193841',
        neutralLight:'#4d5e63',
        gray500:'#6b7280',
        over: '#ccd0d1',
        darkblue: '#1369c4'
      }
    },
  },
  plugins: [],
};
export default config;
