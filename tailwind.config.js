module.exports = {
  mode: 'jit',
  important: true,
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
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
