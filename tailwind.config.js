/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dark: {
          950: '#030712',
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          600: '#262626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'dot-pattern': "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
      },
      backgroundSize: {
        'dot': '24px 24px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
