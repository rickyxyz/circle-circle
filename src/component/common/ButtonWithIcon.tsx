/* eslint-disable react-refresh/only-export-components */
import { VariantProps, cva } from 'class-variance-authority';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import Button, { buttonVariant } from '@/component/common/Button';

const buttonWithIconVariant = cva('', {
  variants: {
    iconPosition: {
      left: 'flex-row',
      right: 'flex-row-reverse',
    },
  },
  defaultVariants: {
    iconPosition: 'left',
  },
});

interface ButtonWithIconProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonWithIconVariant>,
    VariantProps<typeof buttonVariant> {
  icon: ReactNode;
  to?: string;
}

const ButtonWithIcon = forwardRef<HTMLButtonElement, ButtonWithIconProps>(
  ({ children, className, variant, iconPosition, icon, to, ...props }, ref) => {
    return (
      <Button
        className={cn(buttonVariant({ variant }))}
        {...props}
        ref={ref}
        to={to}
      >
        <span
          className={cn(
            'flex flex-row items-center gap-2',
            buttonWithIconVariant({ iconPosition, className })
          )}
        >
          {icon}
          {children}
        </span>
      </Button>
    );
  }
);
ButtonWithIcon.displayName = 'ButtonWithIcon';

export default ButtonWithIcon;
export { ButtonWithIcon, buttonWithIconVariant };
