/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nvssBg: '#0B132B',
        nvssSurface: '#1C2541',
        nvssBorder: '#34415E',
        nvssMuted: '#94A3B8',
        nvssGreen: '#10B981',
        nvssGreenAction: '#059669',
        nvssBlue: '#3B82F6',
        nvssAlert: '#EF4444',
        nvssSlateAction: '#334155',
      },
    },
  },
  plugins: [],
}
