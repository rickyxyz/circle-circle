/* eslint-disable react-refresh/only-export-components */
import { VariantProps, cva } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';

const buttonVariant = cva('', {
  variants: {
    variant: {
      default:
        'rounded-full bg-gray-100 px-4 py-2 text-black capitalize text-sm md:text-base font-semibold hover:bg-gray-300',
      clear: 'rounded-full text-black capitalize',
      noStyle: '',
      icon: 'rounded-full p-1 flex items-center justify-center font-bold bg-gray-100 aspect-square',
    },
    size: {
      default: '',
      sm: 'md:text-sm px-3 py-1',
      xs: 'p-0 text-sm font-semibold',
    },
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
  ({ children, className, size, variant, to, type, ...props }, ref) => {
    const navigate = useNavigate();

    return to ? (
      to === '-1' ? (
        <button
          className={cn(buttonVariant({ variant, size, className }))}
          onClick={() => {
            navigate(-1);
          }}
          {...props}
          ref={ref}
        >
          {children}
        </button>
      ) : (
        <Link
          className={cn(
            buttonVariant({ variant, size, className }),
            'flex items-center'
          )}
          to={to}
          {...props}
        >
          {children}
        </Link>
      )
    ) : (
      <button
        type={type ?? 'button'}
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
