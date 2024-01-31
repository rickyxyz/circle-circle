import { VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Button, { buttonVariant } from '@/component/common/Button';
import useAuth from '@/hook/useAuth';
import { joinCircle, leaveCircle } from '@/lib/circle';
import { customError } from '@/lib/error';
import { FirestoreError } from 'firebase/firestore';
import { Circle } from '@/types/db';
import useUser from '@/hook/useUser';

interface CircleJoinButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariant> {
  circle: Circle;
  userHasJoined: boolean;
}

const CircleJoinButton = forwardRef<HTMLButtonElement, CircleJoinButtonProps>(
  ({ circle, userHasJoined, className, variant, ...props }, ref) => {
    const { user } = useAuth();
    const { addCircle, removeCircle } = useUser();
    const [hasJoined, setHasJoined] = useState<boolean>(userHasJoined);

    function handleJoin() {
      if (!user) {
        throw new customError(
          'unauthorize',
          'you are not authorized to do this'
        );
      }

      joinCircle(
        user,
        circle,
        () => {
          setHasJoined(true);
          addCircle(circle.name);
        },
        // eslint-disable-next-line no-console
        (e: FirestoreError) => console.log(e)
      );
    }

    function handleLeave() {
      if (!user) {
        throw new customError(
          'unauthorize',
          'you are not authorized to do this'
        );
      }

      leaveCircle(
        user,
        circle,
        () => {
          setHasJoined(false);
          removeCircle(circle.name);
        },
        // eslint-disable-next-line no-console
        (e: FirestoreError) => console.log(e)
      );
    }

    return (
      <Button
        className={cn(
          buttonVariant({ variant }),
          !hasJoined && 'bg-emerald-600 text-white hover:bg-emerald-800'
        )}
        {...props}
        ref={ref}
        onClick={hasJoined ? handleLeave : handleJoin}
      >
        <span
          className={cn(
            'flex w-10 flex-row items-center justify-center gap-2',
            className
          )}
        >
          {hasJoined ? 'leave' : 'join'}
        </span>
      </Button>
    );
  }
);
CircleJoinButton.displayName = 'CircleJoinButton';

export default CircleJoinButton;
export { CircleJoinButton };
