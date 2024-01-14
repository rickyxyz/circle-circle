import { Meta, StoryObj } from '@storybook/react';
import CircleHeader from '@/component/circle/CircleHeader';

const meta: Meta<typeof CircleHeader> = {
  component: CircleHeader,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'gray',
      values: [{ name: 'gray', value: '#efefef' }],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CircleHeader>;

export const Default: Story = {
  args: {
    circle: {
      description: 'This is the circle description',
      name: 'ChocolateLover',
      topic: 'culinary',
    },
  },
};

export const DefaultMobile: Story = {
  args: {
    circle: {
      description: 'This is the circle description',
      name: 'ChocolateLover',
      topic: 'culinary',
    },
  },
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile_sm',
    },
  },
};
