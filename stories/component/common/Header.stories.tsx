import { Meta, StoryObj } from '@storybook/react';
import Header from '@/component/common/Header';
import { AuthProvider } from '@/context/AuthProvider';

const meta: Meta<typeof Header> = {
  component: Header,
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

type Story = StoryObj<typeof Header>;

export const LoggedOut: Story = {};
export const LoggedIn: Story = {
  args: {
    user: {
      circle: [],
      uid: 'randomuserid',
      username: 'random username',
      profilePicture: '/profile_placeholder.svg',
    },
  },
};
