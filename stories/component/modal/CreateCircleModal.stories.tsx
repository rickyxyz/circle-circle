import CircleCreateModal from '@/component/modal/CircleCreateModal';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CircleCreateModal> = {
  component: CircleCreateModal,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'gray',
      values: [{ name: 'gray', value: '#2f2f30' }],
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '90vw',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CircleCreateModal>;

export const Default: Story = {};
