import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    'storybook-dark-mode',
  ],
  core: {
    builder: '@storybook/builder-vite',
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  async viteFinal(config) {
    return {
      ...config,
      resolve: {
        alias: [
          {
            find: '@',
            replacement: path.resolve(__dirname, './src'),
          },
          {
            find: '@assets',
            replacement: path.resolve(__dirname, './src/assets'),
          },
          {
            find: '@components',
            replacement: path.resolve(__dirname, './src/components'),
          },
        ],
      },
    };
  },
};
export default config;
