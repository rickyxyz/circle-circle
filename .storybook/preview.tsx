import type { Preview } from '@storybook/react';
// import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { Provider as ReduxProvider } from 'react-redux';
import { themes } from '@storybook/theming';
import store from '@/redux/store';
import '../src/global.css';
import './storybook.css';
import { AuthProvider } from '@/context/AuthProvider';
import { BrowserRouter } from 'react-router-dom';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withProvider = (Story: any) => {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </AuthProvider>
    </ReduxProvider>
  );
};

export default preview;
export const decorators = [withProvider];
