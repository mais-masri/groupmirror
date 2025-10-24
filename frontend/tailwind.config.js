/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        happy: "#FFD166",
        excited: "#EF476F",
        calm: "#06D6A0",
        stressed: "#118AB2",
        sad: "#073B4C",
        primary: "#6C63FF",
      },
    },
  },
  plugins: [],
} 