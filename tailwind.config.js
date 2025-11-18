/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")], // <--- ESTA LÍNEA ES VITAL
  theme: {
    extend: {},
  },
  plugins: [],
}