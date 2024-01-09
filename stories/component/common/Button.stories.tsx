import { Meta, StoryObj } from '@storybook/react';
import Button from '@/component/common/Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: 'button' } };
export const Small: Story = { args: { children: 'button', size: 'sm' } };
export const ClearSmall: Story = {
  args: { children: 'button', variant: 'clear', size: 'sm' },
};
