/* eslint-disable react-refresh/only-export-components */
import { VariantProps, cva } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const buttonVariant = cva('', {
  variants: {
    variant: {
      default:
        'rounded-full bg-gray-100 px-4 py-2 text-black capitalize text-sm md:text-base font-semibold',
      outline: '',
    },
    size: { default: '', sm: 'md:text-sm px-3 py-1' },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>,
    VariantProps<typeof buttonVariant> {
  to?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, size, variant, to, ...props }, ref) => {
    return to ? (
      <Link
        className={cn(buttonVariant({ variant, size, className }))}
        to={to}
        {...props}
      >
        {children}
      </Link>
    ) : (
      <button
        className={cn(buttonVariant({ variant, size, className }))}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export default Button;
export { Button, buttonVariant };
