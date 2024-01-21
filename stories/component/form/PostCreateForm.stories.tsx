import { Meta, StoryObj } from '@storybook/react';
import PostCreateForm from '@/component/form/PostCreateForm';

const meta: Meta<typeof PostCreateForm> = {
  component: PostCreateForm,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ width: '50%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PostCreateForm>;

export const Default: Story = {};
