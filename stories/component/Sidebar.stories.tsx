import { Meta, StoryObj } from '@storybook/react';
import Sidebar from '@/component/Sidebar';

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
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

type Story = StoryObj<typeof Sidebar>;

export const LoggedOut: Story = {};
