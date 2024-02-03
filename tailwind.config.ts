import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        expand: {
          '0%': { width: '0%' },
          '100%': { witdh: '100%' },
        },
        slideup: {
          '0%': { transform: 'scale(1,0)' },
          '100%': { transform: 'scale(1,1)' },
        },
        popup: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        expand: 'expand 0.2s ease-in',
        slideup: 'slideup 0.3s ease-in',
        popup: 'popup 0.3s ease-in',
      },
    },
  },
  plugins: [],
};
export default config;
