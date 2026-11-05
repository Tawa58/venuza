const glassGlow = require("@venuza/design-tokens/colors.json");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        main: glassGlow.main,
        secondary: glassGlow.secondary,
        violet: glassGlow.electricViolet,
        cyan: glassGlow.cyan,
        ink: glassGlow.nearWhite,
        muted: glassGlow.mutedGrey,
      },
    },
  },
  plugins: [],
};
