import Button from '@/component/common/Button';
import useClickedOutside from '@/hook/useClickedOutside';
import useOverlay from '@/hook/useOverlay';
import useWindowSize from '@/hook/useWindowSize';
import { cn } from '@/lib/utils';
import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';

interface DropdownListItem {
  text: string;
  onClick?: () => void;
  className?: HTMLAttributes<HTMLButtonElement>['className'];
  to?: string;
}

interface DropdownListProps
  extends ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  triggerComponent: ReactNode;
  dropdownList: DropdownListItem[];
  dropdownClassName?: HTMLAttributes<HTMLButtonElement>['className'];
}

export default function DropdownList({
  triggerComponent,
  dropdownList,
  className,
  ...props
}: DropdownListProps) {
  const { isMobile } = useWindowSize();
  const { setBottombar, openBottombar, closeBottombar } = useOverlay();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useClickedOutside(() => {
    setDropdownOpen(false);
  }, buttonRef);

  const DropdownList = useMemo(() => {
    return (
      <>
        {dropdownList.map((listItem, idx) => (
          <Button
            key={`dropdown-item-${listItem.text}-${idx}`}
            onClick={() => {
              setDropdownOpen(false);
              closeBottombar();
              listItem.onClick && listItem.onClick();
            }}
            to={listItem.to}
            className={cn(
              'block w-full items-center justify-center px-4 py-2 text-center text-base capitalize text-gray-700 hover:bg-gray-100 hover:text-gray-900',
              listItem.className
            )}
            role="menuitem"
            variant={'noStyle'}
            size={'xs'}
          >
            {listItem.text}
          </Button>
        ))}
      </>
    );
  }, [closeBottombar, dropdownList]);

  const handleButtonClick = () => {
    if (!isMobile) {
      setDropdownOpen(!isDropdownOpen);
    } else {
      setBottombar(DropdownList);
      openBottombar();
    }
  };

  return (
    <div className="relative inline-block text-left">
      <Button
        onClick={handleButtonClick}
        className={cn(
          'flex items-center justify-center bg-transparent',
          className
        )}
        ref={buttonRef}
        hover={'none'}
        variant={'noStyle'}
        {...props}
      >
        {triggerComponent}
      </Button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 z-20 mt-1 w-max origin-top-right rounded-sm bg-white py-1 shadow-sm ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
          ref={dropdownRef}
        >
          {DropdownList}
        </div>
      )}
    </div>
  );
}
