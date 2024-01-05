import { Meta, StoryObj } from '@storybook/react';
import PostCard from '@/component/card/PostCard';
import { Timestamp } from 'firebase/firestore';

const meta: Meta<typeof PostCard> = {
  component: PostCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'gray',
      values: [{ name: 'gray', value: '#efefef' }],
    },
  },
};
export default meta;

type Story = StoryObj<typeof PostCard>;

const now = new Date();
const oneHourAgo = new Date(now);
oneHourAgo.setHours(now.getHours() - 3);

export const Default: Story = {
  args: {
    postId: 'some-post-id',
    circle: { name: 'foodLover', description: 'we love food', topic: 'travel' },
    post: {
      author: 'some-uid',
      description:
        "As I sit back and relax, there's nothing quite like the simple pleasure of savoring a piece of chocolate. The rich, velvety goodness melts on my tongue, sending waves of delight through my taste buds. Whether it's the smoothness of milk chocolate, the intense flavor of dark chocolate, or the delightful crunch of a chocolate-covered treat, each bite feels like a moment of pure bliss. Chocolate, with its comforting and indulgent nature, has a magical way of turning ordinary moments into extraordinary experiences. Who else can't resist the allure of this sweet temptation? Share your favorite chocolate delights and let's celebrate the joy it brings to our lives! 🍫✨ #ChocolateLovers #SweetIndulgence #ChocolateHeaven",
      title: 'I like chocolate',
      postDate: Timestamp.fromDate(oneHourAgo),
      type: 'text',
    },
    user: {
      uid: 'some-uid',
      username: 'John Doe',
      circle: [],
    },
  },
};

export const DefaultLongText: Story = {
  args: {
    postId: 'some-post-id',
    circle: {
      name: 'aReallyReallyLongCircleName',
      description: 'we really really like a long circle name',
      topic: 'entertainment',
    },
    post: {
      author: 'some-uid',
      description: `
      # Embracing the Sweet Symphony: An Ode to My Love for Chocolate
      
      Chocolate, the enchanting confection that transcends taste buds and navigates the journey of emotions, has held a special place in the hearts of millions. As I ponder over the sweet symphony that is chocolate, I find myself immersed in a world where every bite is a dance of flavors, and every aroma is a whisper of joy. This piece is not just an articulation of affection for a treat; it is an ode to the universal joy that is chocolate.
      
      ## The Allure of the Cocoa Bean
      
      At the heart of every delectable chocolate creation lies the cocoa bean, a small, unassuming seed that conceals a universe of flavors. It's fascinating to think that this unassuming bean, carefully cultivated and transformed, can give birth to such an array of tastes, from the silky smoothness of milk chocolate to the profound richness of dark chocolate. Each bite is a testimony to the alchemy that occurs when nature's gift meets the hands of skilled chocolatiers.
      
      ## A Journey of Tastes
      
      Dive into the world of chocolate, and you'll find a spectrum of tastes that cater to every palate. Milk chocolate, with its creamy sweetness, is a comforting embrace reminiscent of childhood days. Dark chocolate, on the other hand, unveils a more complex narrative, with notes of bitterness and a depth that evolves with each
      `,
      title:
        'a really really really long title for a post that does not need a long title',
      postDate: Timestamp.fromDate(oneHourAgo),
      type: 'text',
    },
    user: {
      uid: 'some-uid',
      username: 'John Doe',
      circle: [],
    },
  },
};
