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
      keyframes: {
        'speed-in': {
          '0%': { opacity: '0', transform: 'translateX(-6%) skewX(-10deg)', filter: 'blur(10px)' },
          '100%': { opacity: '1', transform: 'none', filter: 'blur(0)' },
        },
        'speed-line': {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '20%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateX(250%)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '45%, 100%': { transform: 'translateY(400%)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'pit-flow': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(300%)' },
        },
      },
      animation: {
        'speed-in': 'speed-in 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both',
        'speed-line': 'speed-line 1.1s cubic-bezier(0.4, 0, 0.2, 1) both',
        scan: 'scan 7s cubic-bezier(0.45, 0, 0.55, 1) infinite',
        marquee: 'marquee var(--marquee-duration, 40s) linear infinite',
        'pit-flow': 'pit-flow 1.6s ease-in infinite',
      },
    },
  },
  plugins: [],
};
