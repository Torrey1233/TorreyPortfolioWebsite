/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        synthwave: {
          dark: '#0D0D0D',
          cyan: '#00FFFF',
          magenta: '#FF00FF',
          white: '#F5F5F5',
          blue: '#0080FF',
          purple: '#8000FF',
          'dark-blue': '#1a1a2e',
          'deep-blue': '#16213e',
          'ocean-blue': '#0f3460',
          'violet': '#533483',
        },
      },
      fontFamily: {
        orbitron: ["'Orbitron'", 'sans-serif'],
        michroma: ["'Michroma'", 'sans-serif'],
        sharetech: ["'Share Tech Mono'", 'monospace'],
        inter: ["'Inter'", 'sans-serif'],
        poppins: ["'Poppins'", 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'glitch': 'glitch 3s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["synthwave"],
  },
}; 