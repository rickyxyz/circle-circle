import type { Preview } from '@storybook/react';
// import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { themes } from '@storybook/theming';
import '../src/global.css';

const customViewports = {
  mobile_sm: {
    name: 'mobile sm',
    styles: {
      width: '320px',
      height: '600px',
    },
  },
  mobile_md: {
    name: 'mobile md',
    styles: {
      width: '360px',
      height: '800px',
    },
  },
  mobile_lg: {
    name: 'mobile lg',
    styles: {
      width: '428px',
      height: '926px',
    },
  },
  tw_sm: {
    name: 'Tailwind sm',
    styles: {
      width: '640px',
      height: '480px',
    },
  },
  tw_md: {
    name: 'Tailwind md',
    styles: {
      width: '768px',
      height: '1024px',
    },
  },
  tw_lg: {
    name: 'Tailwind lg',
    styles: {
      width: '1024px',
      height: '768px',
    },
  },
  tw_xl: {
    name: 'Tailwind xl',
    styles: {
      width: '1280px',
      height: '720px',
    },
  },
  tw_2xl: {
    name: 'Tailwind 2xl',
    styles: {
      width: '1536px',
      height: '2048px',
    },
  },
  tw_3xl: {
    name: 'Tailwind 2xl',
    styles: {
      width: '2048px',
      height: '1536px',
    },
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      // Override the default dark theme
      dark: { ...themes.dark },
      // Override the default light theme
      light: { ...themes.normal },
    },
    viewport: {
      viewports: {
        // ...INITIAL_VIEWPORTS,
        ...customViewports,
      },
    },
  },
};

export default preview;
