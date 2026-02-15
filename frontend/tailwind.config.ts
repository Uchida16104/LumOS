import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        terminal: {
          bg: '#1a1b26',
          text: '#a9b1d6',
          cursor: '#c0caf5',
          selection: '#33467c',
        },
        editor: {
          bg: '#24283b',
          line: '#1f2335',
          gutter: '#3b4261',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
