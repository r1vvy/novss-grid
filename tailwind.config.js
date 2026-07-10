/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nvssBg: '#F7F3E9',
        nvssSurface: '#FAF8F3',
        nvssBorder: '#E5DEC9',
        nvssMuted: '#6B6560',
        nvssText: '#1C1917',
        nvssGreen: '#B91C1C',
        nvssGreenAction: '#B91C1C',
        nvssSuccess: '#15803D',
        nvssBlue: '#1C1917',
        nvssAlert: '#991B1B',
        nvssSlateAction: '#D7CFBA',
      },
    },
  },
  plugins: [],
}
