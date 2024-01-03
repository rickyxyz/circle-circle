import { Meta, StoryObj } from '@storybook/react';
import Sidebar from '@/component/common/Sidebar';
import { AuthProvider } from '@/context/AuthProvider';

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
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

type Story = StoryObj<typeof Sidebar>;

export const LoggedOut: Story = {};
