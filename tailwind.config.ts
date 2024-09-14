/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          800: '#1F2937',
          900: '#111827',
        },
        blue: {
          400: '#60A5FA',
        },
        green: {
          400: '#34D399',
        },
        yellow: {
          400: '#FBBF24',
        },
        red: {
          400: '#F87171',
        },
      },
    },
  },
  plugins: [],
}
