/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        secondary: {
          50: 'var(--secondary-50)',
          100: 'var(--secondary-100)',
          200: 'var(--secondary-200)',
          300: 'var(--secondary-300)',
          400: 'var(--secondary-400)',
          500: 'var(--secondary-500)',
          600: 'var(--secondary-600)',
          700: 'var(--secondary-700)',
          800: 'var(--secondary-800)',
          900: 'var(--secondary-900)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      spacing: {
        xs: 'var(--size-1)',
        sm: 'var(--size-2)',
        md: 'var(--size-3)',
        lg: 'var(--size-4)',
        xl: 'var(--size-6)',
        '2xl': 'var(--size-8)',
      },
      borderRadius: {
        'sm': 'var(--radius-1)',
        DEFAULT: 'var(--radius-2)',
        'md': 'var(--radius-3)',
        'lg': 'var(--radius-4)',
        'xl': 'var(--radius-5)',
      },
      animation: {
        'fade-in': 'var(--animation-fade-in)',
        'slide-in': 'var(--animation-slide-in)',
      },
      boxShadow: {
        sm: 'var(--shadow-1)',
        DEFAULT: 'var(--shadow-2)',
        md: 'var(--shadow-3)',
        lg: 'var(--shadow-4)',
        xl: 'var(--shadow-5)',
      },
    },
  },
  plugins: [],
}