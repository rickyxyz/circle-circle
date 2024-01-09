import { Meta, StoryObj } from '@storybook/react';
import CircleJoinButton from '@/component/common/CircleJoinButton';

const meta: Meta<typeof CircleJoinButton> = {
  component: CircleJoinButton,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof CircleJoinButton>;

export const DefaultNotJoined: Story = {
  args: {
    circle: {
      description: 'we love good food',
      name: 'foodLover',
      topic: 'culinary',
    },
    userHasJoined: false,
  },
};

export const DefaultJoined: Story = {
  args: {
    circle: {
      description: 'we love good food',
      name: 'foodLover',
      topic: 'culinary',
    },
    userHasJoined: true,
  },
};
