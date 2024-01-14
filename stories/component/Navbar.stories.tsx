import { Meta, StoryObj } from '@storybook/react';
import Navbar from '@/component/Navbar';

const meta: Meta<typeof Navbar> = {
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Navbar>;

export const LoggedOut: Story = {};
