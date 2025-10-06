/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
"./src/**/*.{js,jsx,ts,tsx}",
],
theme: {
extend: {},
},
plugins: [],
}


export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A",
        success: "#10B981",
        accent: "#38BDF8",
        surface: "#F3F4F6",
        textBody: "#111827",
        error: "#DC2626",
      },
    },
  },
  plugins: [],
};
