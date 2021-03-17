module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // Configure your color palette here
        green:{
          450:'#09e359'
        },
      },
    },
    
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
