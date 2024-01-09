import { Meta, StoryObj } from '@storybook/react';
import ButtonWithIcon from '@/component/common/ButtonWithIcon';
import { MdOutlineRadioButtonChecked } from 'react-icons/md';

const meta: Meta<typeof ButtonWithIcon> = {
  component: ButtonWithIcon,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof ButtonWithIcon>;

export const Default: Story = {
  args: { children: 'button', icon: <MdOutlineRadioButtonChecked /> },
};
