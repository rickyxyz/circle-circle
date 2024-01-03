/* eslint-disable react-refresh/only-export-components */
import { VariantProps, cva } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const buttonVariant = cva('', {
  variants: {
    variant: {
      default: 'rounded bg-blue-500 px-4 py-2 text-white',
      outline: '',
    },
    size: { default: '', sm: '' },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariant> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, size, variant, ...props }) => {
    return (
      <button
        className={cn(buttonVariant({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
export { Button, buttonVariant };
