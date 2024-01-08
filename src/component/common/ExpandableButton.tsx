import { VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import Button, { buttonVariant } from '@/component/common/Button';

interface ExpandableButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariant> {
  icon: ReactNode;
  onclick: () => void;
  to?: string;
}

const ExpandableButton = forwardRef<HTMLButtonElement, ExpandableButtonProps>(
  ({ children, className, variant, icon, to, onclick, ...props }, ref) => {
    return (
      <Button
        onClick={onclick}
        className={cn(
          'group flex w-10 items-center gap-0 transition-all hover:w-fit hover:gap-1',
          buttonVariant({ variant }),
          className
        )}
        {...props}
        ref={ref}
        to={to}
      >
        {icon}
        <p className="w-0 overflow-hidden transition-all group-hover:w-fit">
          {children}
        </p>
      </Button>
    );
  }
);
ExpandableButton.displayName = 'ExpandableButton';

export default ExpandableButton;
export { ExpandableButton };
