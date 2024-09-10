/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

const rotateY = plugin(function({ addUtilities }){
  addUtilities({
    '.rotate-y-180': {
      transform: "rotateY(180deg)"
    },
    '.-rotate-y-180': {
      transform: "rotateY(-180deg)"
    },
  })
})

// Custom plugin for backface-visibility
const backfaceVisibility = plugin(function({ addUtilities }) {
  addUtilities({
    '.backface-visible': {
      'backface-visibility': 'visible',
    },
    '.backface-hidden': {
      'backface-visibility': 'hidden',
    },
  });
});

module.exports = {
  content: ["./docs/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [rotateY, backfaceVisibility],
}

