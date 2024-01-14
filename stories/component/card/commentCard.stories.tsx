import { Meta, StoryObj } from '@storybook/react';
import CommentCard from '@/component/card/CommentCard';
import { Timestamp } from 'firebase/firestore';

const meta: Meta<typeof CommentCard> = {
  component: CommentCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'gray',
      values: [{ name: 'gray', value: '#efefef' }],
    },
  },
};
export default meta;

type Story = StoryObj<typeof CommentCard>;

export const Default: Story = {
  args: {
    commentData: {
      author: 'username',
      text: 'This is a comment',
      postDate: Timestamp.now(),
    },
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: '320px' }}>
          <Story />
        </div>
      );
    },
  ],
};
