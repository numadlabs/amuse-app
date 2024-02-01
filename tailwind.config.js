/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    container:{
      center:true,
      padding: '0 40px'
    },
    fontSize: {
      xs: ["10px", "12px"],
      sm: ["12px", "16px"],
      md: ["14px", "18px"],
      lg: ["17px", "24px"],
      lg2: ["16px", "20px"],
      xl: ["20px", "24px"],
      "2xl": ["24px", "36px"],
      "3xl": ["32px", "44px"],
      "4xl": ["40px", "54px"],
      "5xl": ["56px", "58px"],
      "6xl": ["64px", "64px"],
    },
    extend: {
      backdropBlur:{
        "xs": '8px',
        "sm": '16px',
        "md": '24px',
        "lg": '32px',
      },
      boxShadow:{
        "boxShadow": '0px 4px 12px rgba(60, 60, 60, 0.10)'
      },
      colors: {
        baseWhite: '#FFFFFF',
        baseBlack: '#212121',
        baseBlackBg: '#212121/50',

        gray50: '#F0F0F0',
        gray100: '#DEDEDE',
        gray200: '#B6B6B6',
        gray300: '#8D8D8D',
        gray400: '#656565',
        gray500: '#3C3C3C',
        gray600: '#141414',

        systemSuccess: '#2CB59E',
        systemSuccessBg: '#2CB59E/50',
        systemError: '#FF5C69',
        systemErrorBg: '#FF5C69/50',
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
