/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nest: "#F59E0B",
        perch: "#3B82F6",
        family: "#10B981",
        villa: "#8B5CF6",
        castle: "#EC4899",
        crown: "#F97316",
      },
      fontFamily: {
        display: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
