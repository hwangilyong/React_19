import type { Meta, StoryObj } from '@storybook/react';
import BtnBasic from './BtnBasic';

const meta: Meta<typeof BtnBasic> = {
  title: 'Shared/Buttons/BtnBasic',
  component: BtnBasic,
  args: {
    children: 'Button',
    theme: 'white',
  },
};

export default meta;

type Story = StoryObj<typeof BtnBasic>;

export const Default: Story = {};

export const Blue: Story = {
  args: {
    theme: 'blue',
    children: 'Primary',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'With icon',
    leftIco:
      'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 16 16%22%3E%3Ccircle cx=%228%22 cy=%228%22 r=%228%22 fill=%22%234880FF%22/%3E%3C/svg%3E',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};
