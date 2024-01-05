import { Meta, StoryObj } from '@storybook/react';
import CircleCard from '@/component/card/CircleCard';

const meta: Meta<typeof CircleCard> = {
  component: CircleCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'gray',
      values: [{ name: 'gray', value: '#efefef' }],
    },
  },
};
export default meta;

type Story = StoryObj<typeof CircleCard>;

export const Default: Story = {
  args: {
    circle: {
      name: 'foodLover',
      description: 'we love food',
      topic: 'culinary',
    },
  },
};

export const DefaultLongText: Story = {
  args: {
    circle: {
      name: 'aReallyReallyLongCircleName',
      description: 'we really really like a long circle name',
      topic: 'entertainment',
    },
  },
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'mobile_sm',
    },
  },
};

export const DefaultInContainer: Story = {
  args: {
    circle: {
      name: 'foodLover',
      description: 'we love food',
      topic: 'culinary',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100vw' }}>
        <Story />
      </div>
    ),
  ],
};

export const DefaultLongTextInContainer: Story = {
  args: {
    circle: {
      name: 'aReallyReallyLongCircleName',
      description: 'we really really like a long circle name',
      topic: 'entertainment',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100vw' }}>
        <Story />
      </div>
    ),
  ],
};
