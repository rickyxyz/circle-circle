import { Meta, StoryObj } from '@storybook/react';
import App from '@/App';

const meta = {
  title: 'App page',
  component: App,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof App>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AppPage: Story = {};
