/* eslint-disable no-console */
import { Meta, StoryObj } from '@storybook/react';
import DropdownList from '@/component/common/DropdownList';
import { GoKebabHorizontal } from 'react-icons/go';

const meta: Meta<typeof DropdownList> = {
  component: DropdownList,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof DropdownList>;

export const Default: Story = {
  args: {
    triggerComponent: <GoKebabHorizontal />,
    dropdownList: [
      {
        text: 'item 1',
        onClick: () => {
          console.log('item 1');
        },
      },
      {
        text: 'item 2',
        onClick: () => {
          console.log('item 2');
        },
      },
      {
        text: 'item 3',
        onClick: () => {
          console.log('item 3');
        },
      },
    ],
  },
};
