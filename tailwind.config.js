/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-void': '#0a0a0f',
        'bg-panel': '#12121e',
        'neon-green': '#00f5a0',
        'neon-gold': '#f5a623',
        'neon-red': '#ff3b5c',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'header': ['"Rajdhani"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
        'cinematic': ['"Playfair Display"', 'serif'],
      }
    },
  },
  plugins: [],
}
