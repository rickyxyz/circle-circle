/* eslint-disable react-refresh/only-export-components */
import { VariantProps, cva } from 'class-variance-authority';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Circle } from '@/types/db';
import { Link } from 'react-router-dom';
import { FaUserGroup } from 'react-icons/fa6';

const circleCardVariant = cva('', {
  variants: {
    variant: {
      default: '',
      compact: '',
      text: '',
    },
    size: { default: '', sm: '' },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface CircleCardProps extends VariantProps<typeof circleCardVariant> {
  circle: Circle;
  className?: HTMLAttributes<HTMLDivElement>['className'];
}

export default function CircleCard({
  circle,
  variant,
  className,
  ...props
}: CircleCardProps) {
  return (
    <div
      className={cn(
        'grid w-64 grid-cols-12 items-center gap-x-3 bg-white px-4 py-2 text-slate-900',
        circleCardVariant({ variant, className })
      )}
      {...props}
    >
      <img
        src="/profile_placeholder.svg"
        alt="img"
        className="col-span-3 mr-3 h-14"
      />
      <div className="col-span-7 flex flex-col">
        <Link to={`/c/${circle.name}`} className="hover:underline">
          <h2 className="overflow-hidden text-ellipsis text-nowrap font-bold leading-5">
            c/{circle.name}
          </h2>
        </Link>
        <p className="overflow-hidden text-ellipsis text-nowrap leading-5">
          {circle.description}
        </p>
        <span className="flex flex-row items-center gap-1">
          <FaUserGroup />
          <p className="text-slate-400">10 members</p>
        </span>
      </div>
    </div>
  );
}

export { CircleCard, circleCardVariant };
