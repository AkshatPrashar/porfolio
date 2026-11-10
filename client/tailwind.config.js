const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: token('black'),
      carbon: token('carbon'),
      surface: token('surface'),
      red: token('red'),
      green: token('green'),
      purple: token('purple'),
      ink: token('ink'),
      muted: token('muted'),
      line: token('line'),
    },
    fontFamily: {
      display: ['"Chakra Petch"', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'monospace'],
    },
    extend: {
      borderColor: ({ theme }) => ({ DEFAULT: theme('colors.line') }),
    },
  },
  plugins: [],
};
