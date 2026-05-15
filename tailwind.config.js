/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,jsx}', './src/design/**/*.{tsx,ts,jsx,js}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bone: '#f8f6f2',
        graphite: '#1a1a1a',
        oak: '#e8dfd3',
        slate: { 900: '#1a1a1a', 700: '#3a3a3a' },
        walnut: '#a87856',
        carrara: '#ededea',
      },
      fontFamily: {
        display: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(4rem, 12vw, 11rem)', { lineHeight: '0.88', letterSpacing: '-0.04em' }],
        'display-lg': ['clamp(3rem, 7vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      },
      spacing: {
        '18': '4.5rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      keyframes: {
        reveal: { '0%': { transform: 'translateY(100%)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      animation: {
        reveal: 'reveal 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
