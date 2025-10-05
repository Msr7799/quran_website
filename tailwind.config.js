/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx}',
    './src/registry/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Uthmanic Hafs', 'Amiri', 'serif'],
        'uthmanic': ['Uthmanic Hafs', 'serif'],
        'cairo': ['Cairo', 'sans-serif'],
        'sans': ['Uthmanic Hafs', 'system-ui', 'sans-serif'],
        'serif': ['Uthmanic Hafs', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
