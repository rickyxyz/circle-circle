import { Meta, StoryObj } from '@storybook/react';
import Bottombar from '@/component/common/Bottombar';
import { AuthProvider } from '@/context/AuthProvider';

const meta: Meta<typeof Bottombar> = {
  component: Bottombar,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile_sm',
    },
  },
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Bottombar>;

export const LoggedOut: Story = {};
