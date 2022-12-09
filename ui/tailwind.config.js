module.exports = {
	  content: [
		    "./pages/**/*.{js,ts,jsx,tsx}",
		    "./pages/*.{js,ts,jsx,tsx}",
		    "./components/**/*.{js,ts,jsx,tsx}",
	  ],
	  theme: {
		    extend: {},
        container: {
            center: true,
        },
	  },
	  plugins: [require("@tailwindcss/typography"), require("daisyui")],
	  daisyui: {
		    themes: ["synthwave"],
	  },
};
