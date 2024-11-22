/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
            roboto: ["Roboto", "sans-serif"],
        },
        colors: {
            'dofawa_orange': '#FFA124',
        }
    },
  },
  plugins: [],
}

