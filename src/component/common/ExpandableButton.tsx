import { VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import Button, { buttonVariant } from '@/component/common/Button';

interface ExpandableButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariant> {
  icon: ReactNode;
  to?: string;
}

const ExpandableButton = forwardRef<HTMLButtonElement, ExpandableButtonProps>(
  ({ children, className, variant, icon, to, ...props }, ref) => {
    return (
      <Button
        className={cn(
          'group flex w-10 items-center gap-0 transition-all hover:w-[6.5rem] hover:gap-1',
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
