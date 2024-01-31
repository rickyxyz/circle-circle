import { VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, ReactNode, forwardRef, useState } from 'react';
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
    const [isMounted, setIsMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <Button
        onClick={onclick}
        onMouseEnter={() => {
          setIsExpanded(true);
        }}
        onMouseLeave={() => {
          setIsExpanded(false);
          setIsMounted(false);
        }}
        className={cn(
          'flex h-10 w-fit items-center gap-0 duration-100 hover:gap-1',
          buttonVariant({ variant }),
          className
        )}
        {...props}
        ref={ref}
        to={to}
      >
        <span className="w-fit">{icon}</span>
        {isExpanded && (
          <p
            className={cn(!isMounted && 'animation-expand')}
            onAnimationEnd={() => {
              if (!isMounted) setIsMounted(true);
            }}
          >
            {children}
          </p>
        )}
      </Button>
    );
  }
);
ExpandableButton.displayName = 'ExpandableButton';

export default ExpandableButton;
export { ExpandableButton };
