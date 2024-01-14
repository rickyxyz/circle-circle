import { Meta, StoryObj } from '@storybook/react';
import ExpandableButton from '@/component/common/ExpandableButton';
import { MdOutlineRadioButtonChecked } from 'react-icons/md';

const meta: Meta<typeof ExpandableButton> = {
  component: ExpandableButton,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof ExpandableButton>;

export const Default: Story = {
  args: { children: 'button', icon: <MdOutlineRadioButtonChecked size={15} /> },
};
