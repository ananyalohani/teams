const colors = require('tailwindcss/colors');

module.exports = {
  mode: 'jit',
  important: true,
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minHeight: {
      0: '0',
      '1/4': '25%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%',
      screen: '100vh',
    },
    extend: {
      width: {
        100: '28rem',
        110: '30rem',
        120: '34rem',
      },
      colors: {
        gray: colors.coolGray,
        trueGray: colors.trueGray,
        gray: {
          850: '#1F2737',
          875: '#182030',
          950: '#080B10',
        },
        lime: colors.lime,
        orange: colors.orange,
      },
      scale: {
        '-1': '-1',
      },
    },
    fontFamily: {
      sans: ['SegoeUI', 'ui-sans-serif', 'system-ui'],
      body: ['SegoeUI', 'ui-sans-serif', 'system-ui'],
      display: ['SegoeUI', 'ui-sans-serif', 'system-ui'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
