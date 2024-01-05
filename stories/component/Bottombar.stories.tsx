import { Meta, StoryObj } from '@storybook/react';
import Bottombar from '@/component/Bottombar';

const meta: Meta<typeof Bottombar> = {
  component: Bottombar,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile_sm',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Bottombar>;

export const LoggedOut: Story = {};
